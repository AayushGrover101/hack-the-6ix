import { useState, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  AppState,
  Button,
  Vibration,
} from "react-native";
import { Image } from "expo-image";
import Slider from "@react-native-community/slider";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { CompassHeading } from "@/components/CompassHeading";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import ParallaxScrollView from "@/components/ParallaxScrollView";

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

export default function TabOneScreen() {
  const [appState, setAppState] = useState(AppState.currentState);
  const [currTestLocation, setCurrTestLocation] =
    useState<Location.LocationObject | null>(null);
  const [detected, setDetected] = useState<boolean>(false); // TODO: make this a context or global state or smth

  const [buzzDuration, setBuzzDuration] = useState(200);
  const [waitTime, setWaitTime] = useState(500);
  const intervalRef = useRef<number | null>(null);
  
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

  // make bzzzzzzzzz
  useEffect(() => {
    if (detected) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const startRepeatingVibration = () => {
        Vibration.vibrate(buzzDuration);

        const interval = setInterval(() => {
          Vibration.vibrate(buzzDuration);
        }, waitTime);

        intervalRef.current = interval;
      };

      startRepeatingVibration();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      Vibration.cancel();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      Vibration.cancel();
    };
  }, [buzzDuration, waitTime, detected]);

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

        // For iOS in Expo Go, skip background location and go straight to foreground fallback
        if (Platform.OS === 'ios') {
          console.log("iOS detected - skipping background location, using foreground location for Expo Go compatibility");
          // Skip to periodic location fetching for iOS
        } else {
          // Try background location for Android
          try {
            await Location.startLocationUpdatesAsync(
              LOCATION_TASK_NAME,
              locationConfig
            );
            console.log("Location tracking started successfully");
            return; // Success, exit early
          } catch (backgroundError) {
            console.log("Background location failed, trying fallback:", backgroundError);
          }
        }

        // Fallback for both iOS and failed Android attempts
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
        
      } catch (error) {
        console.error("Error setting up location:", error);
        
        console.log("Using basic periodic fetching as final fallback...");
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
      // Safety check to prevent E_TASK_NOT_FOUND error
      TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME).then(
        (isRegistered) => {
          if (isRegistered) {
            Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(
              console.error
            );
          }
        }
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

  // useEffect(() => {
  //   if (detected) {
  //     router.push("/(tabs)/detectedPage");
  //   }
  // }, [detected]);

  return (
    <ThemedView style={styles.container}>
      {/* <CompassHeading /> */}

      <Button
        onPress={() => setDetected(!detected)}
        title={detected ? "Stop Detection" : "Start Detection"}
      />

      {detected ? (
        <ThemedView style={styles.detectionContainer}>
          <ThemedText style={styles.detectionText}>
            🎯 Someone detected nearby!
          </ThemedText>
          <ThemedView style={styles.sliderContainer}>
            <ThemedText style={styles.sliderLabel}>
              Buzz Duration: {buzzDuration.toFixed(0)}ms
            </ThemedText>
            <Slider
              style={styles.slider}
              minimumValue={100}
              maximumValue={300}
              value={buzzDuration}
              onValueChange={setBuzzDuration}
              minimumTrackTintColor="#4785EA"
              maximumTrackTintColor="#d3d3d3"
            />
          </ThemedView>

          <ThemedView style={styles.sliderContainer}>
            <ThemedText style={styles.sliderLabel}>
              Wait Time: {waitTime.toFixed(0)}ms ({(waitTime / 1000).toFixed(2)}
              s)
            </ThemedText>
            <Slider
              style={styles.slider}
              minimumValue={150}
              maximumValue={1500}
              value={waitTime}
              onValueChange={setWaitTime}
              minimumTrackTintColor="#ff6b6b"
              maximumTrackTintColor="#d3d3d3"
            />
          </ThemedView>
        </ThemedView>
      ) : (
        <>
          <ThemedText type="title" style={styles.title}>
            It&apos;s quiet here...
          </ThemedText>
          <ThemedText style={styles.subtitle}>No one is nearby.</ThemedText>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingBottom: Platform.OS === "ios" ? 92 : 96,
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
  detectionContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "rgba(71, 133, 234, 0.1)",
    borderRadius: 12,
    width: "90%",
    alignItems: "center",
  },
  detectionText: {
    fontSize: 18,
    fontFamily: "GeneralSanMedium",
    color: "#4785EA",
    marginBottom: 15,
    textAlign: "center",
  },
  sliderContainer: {
    marginVertical: 15,
    width: "100%",
  },
  sliderLabel: {
    fontSize: 14,
    fontFamily: "GeneralSanMedium",
    color: "#737373",
    marginBottom: 5,
    textAlign: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
});
