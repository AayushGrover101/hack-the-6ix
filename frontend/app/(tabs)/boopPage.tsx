import { useState, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  AppState,
  Button,
  Vibration,
  View,
} from "react-native";
import { Image } from "expo-image";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Compass from "@/components/Compass";
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

export default function TabOneScreen() {
  const [appState, setAppState] = useState(AppState.currentState);
  const [detected, setDetected] = useState<boolean>(false); // TODO: make this a context or global state or smth

  const [buzzDuration, setBuzzDuration] = useState(200);
  const [waitTime, setWaitTime] = useState(500);
  const intervalRef = useRef<number | null>(null);

  // Gradient state - now controlled by progress
  const [topGradientBlue, setTopGradientBlue] = useState(true); // true = #4785EA, false = #F06C6C

  // Slider state
  const [sliderValue, setSliderValue] = useState(0); // 0-100, represents progress percentage
  const [arrowRotation, setArrowRotation] = useState(0); // 0-360 degrees

  // Profile image URLs - you can change these to any URLs
  const userProfileImageUrl = "https://media.licdn.com/dms/image/v2/D5603AQF6gPTl46j53w/profile-displayphoto-shrink_400_400/B56ZX4zDxuHQAk-/0/1743635890387?e=1755734400&v=beta&t=NyhNb_F72PO9N5KdJpaUjP7PNDpyQy8rlP1JLSTSK4c";
  const nearbyUserImageUrl = "https://media.licdn.com/dms/image/v2/D4E03AQEfniTcrGSV0Q/profile-displayphoto-scale_400_400/B4EZgZlOr9GcAo-/0/1752775847358?e=1755734400&v=beta&t=RUaByqJGG6ElpBzefdcn8olso_Q3KgTrSanQ0XuhUXI";

  // Helper function to calculate bottom gradient color based on intensity
  const getBottomGradientColor = (intensity: number) => {
    // Interpolate between white (255,255,255) and #A76CF0 (167,108,240)
    const r = Math.round(255 - (255 - 167) * (intensity / 100));
    const g = Math.round(255 - (255 - 108) * (intensity / 100));
    const b = Math.round(255 - (255 - 240) * (intensity / 100));
    return `rgb(${r},${g},${b})`;
  };

  // Helper function to get top gradient color
  const getTopGradientColor = (isBlue: boolean) => {
    return isBlue ? "#4785EA" : "#F06C6C";
  };

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
        if (Platform.OS === "ios") {
          console.log(
            "iOS detected - skipping background location, using foreground location for Expo Go compatibility"
          );
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
            console.log(
              "Background location failed, trying fallback:",
              backgroundError
            );
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
        console.log("Initial current location:", location);
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    };

    getCurrentLocation();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <Image
          source={require("@/assets/images/boop/blueBackground.png")}
          style={styles.headerBackgroundImage}
        />
        <View style={styles.headerContent}>
          <Image
            source={require("@/assets/images/boop/blueLoop.png")}
            style={styles.headerIcon}
          />
          <ThemedText style={styles.headerTitle}>boop</ThemedText>
        </View>
      </ThemedView>

      {detected ? (
        <ThemedView style={[styles.detectionContainer]}>
          <LinearGradient
            colors={[
              getTopGradientColor(topGradientBlue),
              getBottomGradientColor(sliderValue),
            ]}
            style={styles.gradientWrapper}
          >
            {sliderValue >= 100 ? (
              <View style={styles.boopedProfilesContainer}>
                {/* Boop text above the profiles */}
                <View style={styles.boopTextContainer}>
                  <ThemedText style={styles.boopText}>boop!</ThemedText>
                </View>
                {/* Sparks effect above the touching profiles */}
                <View style={styles.boopedSparksContainer}>
                  <Svg width="30" height="30" viewBox="0 0 24 22" style={styles.boopedSparksEffect}>
                    <Path d="M7.94882 4.73077C8.41896 3.8895 8.88911 3.04824 9.35925 2.20697C6.93082 1.7972 4.50239 1.38743 2.07396 0.977657C2.24202 1.92661 2.41008 2.87557 2.57814 3.82453C2.60172 3.95763 2.62529 4.09072 2.64886 4.22382C3.07315 6.61955 3.49743 9.01528 3.92172 11.411C3.94529 11.5441 3.96886 11.6772 3.99243 11.8103C4.05837 11.6923 4.12431 11.5743 4.19025 11.4563C5.37717 9.33247 6.56409 7.20861 7.751 5.08475C7.81694 4.96676 7.88288 4.84876 7.94882 4.73077Z" fill="white"/>
                    <Path d="M19.7591 10.8706C21.0368 10.2211 22.3146 9.57165 23.5924 8.92219C21.0273 6.36979 18.4622 3.81739 15.8971 1.26499C15.254 2.54597 14.6109 3.82695 13.9677 5.10792C13.8699 5.30274 13.7721 5.49756 13.6743 5.69237C11.9138 9.19906 10.1533 12.7057 8.39278 16.2124C8.29498 16.4072 8.19717 16.6021 8.09937 16.7969C8.29369 16.6981 8.48802 16.5993 8.68235 16.5006C12.1803 14.7227 15.6782 12.9448 19.1761 11.1669C19.3704 11.0681 19.5647 10.9693 19.7591 10.8706Z" fill="white"/>
                  </Svg>
                </View>
                <View style={styles.boopedProfileImage}>
                  <Image
                    source={userProfileImageUrl}
                    style={styles.boopedAvatar}
                  />
                  <ThemedText style={styles.boopedProfileName}>Aayush</ThemedText>
                </View>
                <View style={styles.boopedProfileImage}>
                  <Image
                    source={nearbyUserImageUrl}
                    style={styles.boopedAvatar}
                  />
                  <ThemedText style={styles.boopedProfileName}>Jesse</ThemedText>
                </View>
              </View>
            ) : (
              <View style={styles.profileCard}>
                <Compass 
                  profileImageUrl={nearbyUserImageUrl}
                  rotation={arrowRotation}
                  size={140}
                />
                <View style={styles.profileInfo}>
                  <ThemedText style={styles.profileName}>Jesse</ThemedText>
                  <ThemedText style={styles.profileDistance}>50m</ThemedText>
                </View>
              </View>
            )}

            {/* Message Text - Row 2 */}
            <View style={[
              styles.messageContainer,
              sliderValue >= 100 && { marginTop: -20 }
            ]}>
              <ThemedText style={styles.messageTitle}>
                {sliderValue >= 100 ? "yippee!!" : "someone's nearby!"}
              </ThemedText>
              <ThemedText style={[
                styles.messageSubtitle
              ]}>
                {sliderValue >= 100 ? "Y'all booped!" : "Go boop them!!"}
              </ThemedText>
            </View>

            {/* Slider Row - Row 3 */}
            <View style={styles.boopSliderContainer}>
                          <View style={[
                            styles.sliderTrack,
                            sliderValue >= 100 && styles.sliderTrackBooped
                          ]}>
              <View style={styles.sliderProgress}>
                {/* Background track */}
                <View style={styles.backgroundTrack} />
                
                {/* Blue left section - grows from left edge */}
                <View
                  style={[
                    styles.blueSection,
                    { width: `${sliderValue * 0.45}%` },
                  ]}
                />

                {/* White middle section - shrinks as avatars approach */}
                <View
                  style={[
                    styles.whiteSection,
                    { 
                      left: `${sliderValue * 0.45}%`,
                      width: `${100 - (sliderValue * 0.9)}%`
                    },
                  ]}
                />

                {/* Blue right section - grows from right edge */}
                <View
                  style={[
                    styles.blueSection,
                    { 
                      left: `${100 - (sliderValue * 0.45)}%`,
                      width: `${sliderValue * 0.45}%`
                    },
                  ]}
                />

                {/* Left avatar - positioned at left edge of progress bar */}
                <View
                  style={[
                    styles.avatarContainer,
                    styles.leftAvatarContainer,
                    { left: `${sliderValue * 0.45}%` }, // Reduced from 0.5 to leave gap
                  ]}
                >
                  <Image
                    source={userProfileImageUrl}
                    style={styles.sliderAvatar}
                  />
                  {/* Sparks effect when progress is 100% */}
                  {sliderValue >= 100 && (
                    <Svg width="25" height="25" viewBox="0 0 24 22" style={styles.sparksEffect}>
                      <Path d="M7.94882 4.73077C8.41896 3.8895 8.88911 3.04824 9.35925 2.20697C6.93082 1.7972 4.50239 1.38743 2.07396 0.977657C2.24202 1.92661 2.41008 2.87557 2.57814 3.82453C2.60172 3.95763 2.62529 4.09072 2.64886 4.22382C3.07315 6.61955 3.49743 9.01528 3.92172 11.411C3.94529 11.5441 3.96886 11.6772 3.99243 11.8103C4.05837 11.6923 4.12431 11.5743 4.19025 11.4563C5.37717 9.33247 6.56409 7.20861 7.751 5.08475C7.81694 4.96676 7.88288 4.84876 7.94882 4.73077Z" fill="white"/>
                      <Path d="M19.7591 10.8706C21.0368 10.2211 22.3146 9.57165 23.5924 8.92219C21.0273 6.36979 18.4622 3.81739 15.8971 1.26499C15.254 2.54597 14.6109 3.82695 13.9677 5.10792C13.8699 5.30274 13.7721 5.49756 13.6743 5.69237C11.9138 9.19906 10.1533 12.7057 8.39278 16.2124C8.29498 16.4072 8.19717 16.6021 8.09937 16.7969C8.29369 16.6981 8.48802 16.5993 8.68235 16.5006C12.1803 14.7227 15.6782 12.9448 19.1761 11.1669C19.3704 11.0681 19.5647 10.9693 19.7591 10.8706Z" fill="white"/>
                    </Svg>
                  )}
                </View>

                {/* Right avatar - positioned at right edge of progress bar */}
                <View
                  style={[
                    styles.avatarContainer,
                    styles.rightAvatarContainer,
                    { left: `${100 - (sliderValue * 0.45)}%` }, // Reduced from 0.5 to leave gap
                  ]}
                >
                  <Image
                    source={nearbyUserImageUrl}
                    style={styles.sliderAvatar}
                  />
                  {/* Sparks effect when progress is 100% */}
                  {sliderValue >= 100 && (
                    <Svg width="40" height="40" viewBox="0 0 24 22" style={styles.sparksEffect}></Svg>
                  )}
                </View>
              </View>
            </View>

              {/* Slider controls - always show for testing */}
              <View style={styles.compactSliderContainer}>
                <Slider
                  style={styles.compactSlider}
                  minimumValue={0}
                  maximumValue={100}
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  minimumTrackTintColor="#4785EA"
                  maximumTrackTintColor="#d3d3d3"
                />
                <Slider
                  style={styles.compactSlider}
                  minimumValue={0}
                  maximumValue={360}
                  value={arrowRotation}
                  onValueChange={setArrowRotation}
                  minimumTrackTintColor="#F06C6C"
                  maximumTrackTintColor="#d3d3d3"
                />
              </View>
            </View>

            {/* Gradient Controls - Collapsible */}
            {/* <ThemedView style={styles.gradientControls}>
              <ThemedText style={styles.sliderLabel}>
                Bottom Gradient Intensity: {gradientIntensity.toFixed(0)}%
              </ThemedText>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={gradientIntensity}
                onValueChange={setGradientIntensity}
                minimumTrackTintColor="#A76CF0"
                maximumTrackTintColor="#d3d3d3"
              />

              <ThemedText style={styles.sliderLabel}>
                Top Gradient: {topGradientBlue ? "Blue" : "Red"}
              </ThemedText>
              <Button
                title={`Switch to ${topGradientBlue ? "Red" : "Blue"}`}
                onPress={() => setTopGradientBlue(!topGradientBlue)}
              />
            </ThemedView>

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
                Wait Time: {waitTime.toFixed(0)}ms (
                {(waitTime / 1000).toFixed(2)}
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
            </ThemedView> */}
          </LinearGradient>
        </ThemedView>
      ) : (
        <ThemedView style={styles.quietContainer}>
          <Image
            source={require("@/assets/images/boop/leaf.png")}
            style={styles.quietImage}
          />
          <ThemedText type="title" style={styles.title}>
            It&apos;s quiet here...
          </ThemedText>
          <ThemedText style={styles.subtitle}>No one is nearby.</ThemedText>
        </ThemedView>
      )}

      <Button
        onPress={() => setDetected(!detected)}
        title={detected ? "Stop Detection" : "Start Detection"}
      />
      {/* <Button
          onPress={() => setDetected(!detected)}
          title={detected ? "Stop Detection" : "Start Detection"}
        /> */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    position: "relative",
    height: 125,
    paddingVertical: 12,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 1,
  },
  headerBackgroundImage: {
    position: "absolute",
    width: "100%",
    height: 125,
    objectFit: "contain",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  headerIcon: {
    width: 40, // Reduced from 40px
    height: 40, // Reduced from 40px
    resizeMode: "contain",
    marginRight: 10,
  },
  headerTitle: {
    fontFamily: "ItcKabelDemi",
    fontSize: 42,
    lineHeight: 45,
    color: "#4785EA",
    textAlign: "center",
  },
  content: {
    padding: 20,
    alignItems: "center",
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
    width: "100%",
    height: "100%",
    position: "relative",
    alignItems: "center",
  },
  gradientWrapper: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 32,
    paddingTop: 70,
  },
  gradientControls: {
    marginVertical: 15,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    padding: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 60,
    height: 200, // Fixed height to match booped container
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontFamily: "GeneralSanMedium",
    color: "#fff",
    marginBottom: 12,
  },
  profileDistance: {
    fontSize: 64,
    lineHeight: 64,
    fontFamily: "ItcKabelDemi",
    color: "#fff",
  },
  messageContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 80,
    textAlign: "center",
  },
  messageTitle: {
    fontSize: 40,
    lineHeight: 40,
    marginBottom: 40,
    fontFamily: "ItcKabelDemi",
    color: "#FFFFFF",
    width: "100%",
  },
  messageSubtitle: {
    top: -28,
    fontSize: 24,
    fontFamily: "GeneralSanMedium",
    color: "rgba(255,255,255,0.8)",
  },
  boopSliderContainer: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    marginBottom: 40,
  },
  sliderTrack: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 25,
    width: "70%",
    height: 8,
  },
  sliderTrackBooped: {
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  sliderProgress: {
    width: "100%",
    height: "100%",
    borderRadius: 17,
    position: "relative",
    overflow: "visible", // Changed to visible so avatars can extend beyond bounds
  },
  backgroundTrack: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%", // Background track covers full width
    height: "100%",
    backgroundColor: "rgba(200,200,200,0.4)", // Light gray background
    borderRadius: 17,
    zIndex: 0,
  },
  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "#4785EA",
    borderRadius: 17,
    zIndex: 1,
  },
  blueSection: {
    position: "absolute",
    top: 0,
    height: "100%",
    backgroundColor: "#4785EA",
    borderRadius: 17,
    zIndex: 1,
  },

  whiteSection: {
    position: "absolute",
    top: 0,
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    zIndex: 1,
  },
  avatarContainer: {
    position: "absolute",
    top: -20,
    width: 50,
    height: 50,
    zIndex: 10, // Increased z-index to bring avatars to front
  },
  leftAvatarContainer: {
    transform: [{ translateX: -25 }], // Center the avatar on its position
    zIndex: 12, // Higher z-index than right avatar
  },
  rightAvatarContainer: {
    transform: [{ translateX: -25 }], // Center the avatar on its position (50px width - 32px = 18px)
    zIndex: 11, // Lower z-index than left avatar
  },
  sparksEffect: {
    position: "absolute",
    top: -23,
    left: 33,
    width: 40,
    height: 40,
    zIndex: 13, // Higher than avatars
  },
  userAvatars: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  sliderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleContainer: {
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  sliderControlContainer: {
    marginTop: 20,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 8,
    padding: 12,
  },
  compactSliderContainer: {
    marginTop: 45,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 8,
    padding: 8,
  },
  compactSlider: {
    width: "100%",
    height: 20,
    marginVertical: 2,
  },
  detectionText: {
    fontSize: 18,
    fontFamily: "GeneralSanMedium",
    color: "#FFFFFF",
    marginBottom: 15,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
  quietContainer: {
    marginTop: -90,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  quietTitle: {
    fontFamily: "ItcKabelDemi",
    fontSize: 24,
    color: "#737373",
    textAlign: "center",
    marginBottom: 10,
  },
  quietSubtitle: {
    fontFamily: "GeneralSanMedium",
    fontSize: 16,
    color: "#737373",
    textAlign: "center",
  },
  quietImage: {
    position: "relative",
    width: 200,
    height: 450,
    marginTop: -50,
    marginBottom: 20,
    objectFit: "contain",
  },
  boopedProfilesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginBottom: 60,
    marginTop: 20,
    gap: 0, // Remove gap so images touch
    height: 200, // Fixed height to match profileCard
    position: "relative", // Add position relative for sparks positioning
  },
  boopedSparksContainer: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: [{ translateX: -8 }], // Center the sparks
    zIndex: 15, // Higher than everything else
  },
  boopedSparksEffect: {
    width: 60,
    height: 60,
  },
  boopTextContainer: {
    position: "absolute",
    top: -50,
    left: "50%",
    transform: [{ translateX: -50 }],
    alignItems: "center",
    zIndex: 16, // Higher than sparks
  },
  boopText: {
    fontSize: 42,
    lineHeight: 42,
    fontFamily: "ItcKabelDemi",
    color: "#FFFFFF",
    textAlign: "center",
  },
  boopedProfileImage: {
    alignItems: "center",
  },
  boopedAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  boopedProfileName: {
    fontSize: 18,
    fontFamily: "GeneralSanMedium",
    color: "#fff",
    marginTop: 12,
    textAlign: "center",
  },
});

