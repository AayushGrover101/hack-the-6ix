import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Platform, StyleSheet, AppState, Button } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CompassHeading } from "@/components/CompassHeading";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "background-location-task";
let sharedLocationCallback:
  | ((location: Location.LocationObject) => void)
  | null = null;

// location task for background updates
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
  if (error) {
    console.error("Background location task error:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    const timestamp = new Date().toLocaleTimeString();
    console.log(
      `[${timestamp}] Background location task received ${locations?.length} locations`
    );

    if (locations && locations.length > 0 && sharedLocationCallback) {
      const callback = sharedLocationCallback;
      callback(locations[0]);
    }
  }
});

export default function HomeScreen() {
  const [appState, setAppState] = useState(AppState.currentState);
  const [currTestLocation, setCurrTestLocation] =
    useState<Location.LocationObject | null>(null);
  const [detected, setDetected] = useState<boolean>(false); // TODO: make this a context or global state or smth
  // const [toggleDND, setToggleDND] = useState<boolean>(false);

  useEffect(() => {
    const handleAppStateChange = (
      nextAppState: typeof AppState.currentState
    ) => {
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    let cleanupInterval: any;

    sharedLocationCallback = (location: Location.LocationObject) => {
      setCurrTestLocation(location);
      const timestamp = new Date().toLocaleTimeString();
      const mode = appState === "active" ? "FOREGROUND" : "BACKGROUND";
      console.log(`[${timestamp}] ${mode} Location updated:`, {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      });
    };

    const setupLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Foreground permission denied");
          return;
        }

        if (Platform.OS !== "ios") {
          try {
            const { status: backgroundStatus } =
              await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus !== "granted") {
              console.log("Background permission denied on Android");
            }
          } catch (bgError) {
            console.log(
              "Background permission request failed on Android:",
              bgError
            );
          }
        } else {
          console.log(
            "Skipping background permissions on iOS (Expo Go limitation)"
          );
        }

        try {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
          console.log("Stopped existing location updates");
        } catch {
          console.log("No existing location updates to stop");
        }

        const locationConfig = {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // CHANGE FOR ACTUAL REALISTIC STUFF
          distanceInterval: 0, // also this
        };

        console.log(
          `Setting up location tracking for ${Platform.OS}:`,
          locationConfig
        );

        await Location.startLocationUpdatesAsync(
          LOCATION_TASK_NAME,
          locationConfig
        );

        console.log("Location tracking started successfully");
      } catch (error) {
        console.error("Error setting up location:", error);

        console.log("Trying fallback location setup...");
        try {
          const fallbackConfig = {
            accuracy: Location.Accuracy.High,
            timeInterval: Platform.OS === "ios" ? 3000 : 1000,
            distanceInterval: 2,
          };

          await Location.startLocationUpdatesAsync(
            LOCATION_TASK_NAME,
            fallbackConfig
          );
          console.log("Location tracking started with fallback config");
        } catch (fallbackError) {
          console.error("Fallback location setup also failed:", fallbackError);

          console.log("Using periodic getCurrentPosition as final fallback...");

          const periodicLocationFetch = () => {
            Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            })
              .then((location) => {
                if (sharedLocationCallback) {
                  sharedLocationCallback(location);
                }
              })
              .catch((getCurrentError) => {
                console.log("getCurrentPosition failed:", getCurrentError);
              });
          };

          periodicLocationFetch();

          cleanupInterval = setInterval(periodicLocationFetch, 3000);
        }
      }
    };

    const setupLocationWrapper = async () => {
      try {
        await setupLocation();
      } catch {
        console.log(
          "All location methods failed, using basic periodic fetching..."
        );

        const periodicLocationFetch = () => {
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          })
            .then((location) => {
              if (sharedLocationCallback) {
                sharedLocationCallback(location);
              }
            })
            .catch((getCurrentError) => {
              console.log("getCurrentPosition failed:", getCurrentError);
            });
        };

        periodicLocationFetch();

        cleanupInterval = setInterval(periodicLocationFetch, 3000);
      }
    };

    setupLocationWrapper();

    return () => {
      sharedLocationCallback = null;
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(
        console.error
      );
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
      }
    };
  }, [appState]);

  // intiial location
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setCurrTestLocation(location);
        console.log("Initial current location:", location);
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (detected) {
      router.push("/(tabs)/detectedPage");
    }
  }, [detected]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        It&apos;s quiet here...
      </ThemedText>
      <ThemedText style={styles.subtitle}>No one is nearby.</ThemedText>
      {/* <CompassHeading /> */}

      <Button onPress={() => setDetected(true)} title="Go to Detected Page" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingBottom: Platform.OS === 'ios' ? 92 : 96,
  },
  title: {
    fontFamily: "ItcKabelDemi",
    fontSize: 42,
    lineHeight: 50,
    color: "#4785EA",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "GeneralSanMedium",
    fontSize: 24,
    color: "#737373",
    marginBottom: 10,
  },
});
