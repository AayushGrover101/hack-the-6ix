import { useState, useEffect, useRef, useCallback } from "react";
import {
  Platform,
  StyleSheet,
  AppState,
  Button,
  Vibration,
  View,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useUser, getUserById, User } from "@/contexts/UserContext";
import { userService, ApiUser } from "@/services/userService";
import { socketService } from "@/services/socketService";

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

  // Gradient state
  const [gradientIntensity, setGradientIntensity] = useState(50); // 0-100
  const [topGradientBlue, setTopGradientBlue] = useState(true); // true = #4785EA, false = #F06C6C

  // Slider state
  const [sliderValue, setSliderValue] = useState(0); // 0-100, represents progress percentage

  // User context
  const { user, loading, error, switchUser } = useUser();
  
  // Location and nearby users state
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<ApiUser[]>([]);
  const [isSearchingNearby, setIsSearchingNearby] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const nearbySearchInterval = useRef<number | null>(null);
  
  // Use the first nearby user for display (or fallback to mock)
  const nearbyUser = nearbyUsers[0] || getUserById('user2');

  // Initialize Socket.IO connection
  const initializeSocket = useCallback(async () => {
    try {
      await socketService.connect();
      setSocketConnected(true);
      
      // Set up location update listeners
      socketService.onLocationUpdateSuccess((data) => {
        console.log('Location update success:', data);
      });
      
      socketService.onLocationUpdateError((error) => {
        console.error('Location update error:', error);
      });
      
    } catch (error) {
      console.error('Failed to connect to Socket.IO:', error);
      setSocketConnected(false);
    }
  }, []);

  // Update location via Socket.IO
  const updateLocationOnBackend = useCallback(async (location: Location.LocationObject) => {
    if (!user?.uid || !socketConnected) return;
    
    try {
      socketService.updateLocation(
        user.uid,
        location.coords.latitude,
        location.coords.longitude
      );
      console.log('Location sent via Socket.IO');
    } catch (error) {
      console.error('Failed to update location via Socket.IO:', error);
    }
  }, [user?.uid, socketConnected]);

  // Search for nearby users via REST API
  const searchNearbyUsers = useCallback(async (location: Location.LocationObject) => {
    if (!user?.uid) return;
    
    try {
      setIsSearchingNearby(true);
      const nearby = await userService.getNearbyUsers(
        location.coords.latitude,
        location.coords.longitude,
        1000 // 1km radius
      );
      
      // Filter out the current user from nearby results
      const filteredNearby = nearby.filter(u => u.uid !== user.uid);
      setNearbyUsers(filteredNearby);
      
      // Set detected to true if we found nearby users
      const hasNearbyUsers = filteredNearby.length > 0;
      setDetected(hasNearbyUsers);
      
      console.log(`Found ${filteredNearby.length} nearby users:`, filteredNearby.map(u => u.name));
    } catch (error) {
      console.error('Failed to search nearby users:', error);
      // Fall back to no detection on error
      setDetected(false);
      setNearbyUsers([]);
    } finally {
      setIsSearchingNearby(false);
    }
  }, [user?.uid]);

  // Start periodic nearby user search
  const startNearbySearch = useCallback((location: Location.LocationObject) => {
    // Clear any existing interval
    if (nearbySearchInterval.current) {
      clearInterval(nearbySearchInterval.current);
    }
    
    // Search immediately
    searchNearbyUsers(location);
    
    // Then search every 3 seconds for real-time feel
    nearbySearchInterval.current = setInterval(() => {
      searchNearbyUsers(location);
    }, 3000);
  }, [searchNearbyUsers]);

  // Stop nearby user search
  const stopNearbySearch = useCallback(() => {
    if (nearbySearchInterval.current) {
      clearInterval(nearbySearchInterval.current);
      nearbySearchInterval.current = null;
    }
    setNearbyUsers([]);
    setDetected(false);
  }, []);

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

  // Initialize Socket.IO when component mounts and user is available
  useEffect(() => {
    if (user?.uid) {
      initializeSocket();
    }
    
    return () => {
      // Cleanup socket connection and listeners
      socketService.removeLocationListeners();
      stopNearbySearch();
    };
  }, [user?.uid, initializeSocket, stopNearbySearch]);

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

      // Update state with current location
      setCurrentLocation(location);
      
      // Update location via Socket.IO
      updateLocationOnBackend(location);
      
      // Start nearby search if we have a user
      if (user?.uid) {
        startNearbySearch(location);
      }
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
      // Cleanup nearby search interval
      if (nearbySearchInterval.current) {
        clearInterval(nearbySearchInterval.current);
      }
    };
  }, [appState, updateLocationOnBackend, startNearbySearch, user?.uid]);

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

      {loading ? (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading user data...</ThemedText>
        </ThemedView>
      ) : error ? (
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Error: {error}</ThemedText>
        </ThemedView>
      ) : detected ? (
        <ThemedView style={[styles.detectionContainer]}>
          <LinearGradient
            colors={[
              getTopGradientColor(topGradientBlue),
              getBottomGradientColor(gradientIntensity),
            ]}
            style={styles.gradientWrapper}
          >
            <View style={styles.profileCard}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={
                    nearbyUser?.profilePicture 
                      ? { uri: nearbyUser.profilePicture }
                      : require("@/assets/images/adaptive-icon.png")
                  }
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.profileName}>
                  {nearbyUser?.name || 'Unknown User'}
                </ThemedText>
                <ThemedText style={styles.profileDistance}>50m</ThemedText>
              </View>
            </View>

            {/* Message Text - Row 2 */}
            <View style={styles.messageContainer}>
              <ThemedText style={styles.messageTitle}>
                someone&apos;s nearby!
              </ThemedText>
              <ThemedText style={styles.messageSubtitle}>
                Go boop them!!
              </ThemedText>
            </View>

            {/* Slider Row - Row 3 */}
            <View style={styles.boopSliderContainer}>
              <View style={styles.sliderTrack}>
                <View style={styles.leftArrows}>
                  <ThemedText style={styles.arrowText}> → → → →</ThemedText>
                </View>
                <View style={styles.sliderProgress}>
                  {/* Background track */}
                  <View style={styles.backgroundTrack} />
                  
                  {/* Blue progress bar */}
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${(sliderValue / 95) * 90}%` },
                    ]}
                  />

                  {/* Moving left avatar - Current user (Alice) */}
                  <View
                    style={[
                      styles.avatarContainer,
                      styles.leftAvatarContainer,
                      { left: `${(sliderValue / 95) * 90}%` },
                    ]}
                  >
                    <Image
                      source={
                        user?.profilePicture 
                          ? { uri: user.profilePicture }
                          : require("@/assets/images/adaptive-icon.png")
                      }
                      style={styles.sliderAvatar}
                    />
                  </View>

                  {/* Fixed right avatar - Nearby user (Bob) */}
                  <View
                    style={[
                      styles.avatarContainer,
                      styles.rightAvatarContainer,
                      { left: "90%" },
                    ]}
                  >
                    <Image
                      source={
                        nearbyUser?.profilePicture 
                          ? { uri: nearbyUser.profilePicture }
                          : require("@/assets/images/adaptive-icon.png")
                      }
                      style={styles.sliderAvatar}
                    />
                  </View>
                </View>
                <View style={styles.rightArrows}>
                  <ThemedText style={styles.arrowText}>← →</ThemedText>
                </View>
              </View>

              {/* Slider control for testing */}
              <View style={styles.sliderControlContainer}>
                <ThemedText style={styles.sliderLabel}>
                  Progress: {sliderValue.toFixed(0)}%
                </ThemedText>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={95}
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  minimumTrackTintColor="#4785EA"
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
      
      {/* Debug info */}
      {user && (
        <ThemedView style={styles.debugContainer}>
          <ThemedText style={styles.debugText}>
            Current User: {user.name} ({user.uid})
          </ThemedText>
          <ThemedText style={styles.debugText}>
            Socket: {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </ThemedText>
          <ThemedText style={styles.debugText}>
            Searching: {isSearchingNearby ? '🔄 Yes' : '⏸️ No'}
          </ThemedText>
          {nearbyUsers.length > 0 && (
            <ThemedText style={styles.debugText}>
              Nearby: {nearbyUsers.map(u => u.name).join(', ')}
            </ThemedText>
          )}
          <TouchableOpacity style={styles.switchButton}>
            <ThemedText style={styles.switchButtonText}>Quick Switch User</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
      
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
    height: 105,
    paddingVertical: 12,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    zIndex: 1,
  },
  headerBackgroundImage: {
    position: "absolute",
    width: "100%",
    height: 105,
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
    lineHeight: 38,
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
    paddingTop: 60,
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
    marginBottom: 40,
  },
  profileImageContainer: {
    marginRight: 16,
    borderRadius: 100,
    borderColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#FFFFFF",
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
    fontSize: 42,
    lineHeight: 42,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 25,
    width: "80%",
    height: 22,
  },
  leftArrows: {
    flex: 1,
    alignItems: "center",
  },
  rightArrows: {
    flex: 1,
    alignItems: "center",
  },
  arrowText: {
    fontSize: 18,
    color: "#4785EA",
    fontFamily: "GeneralSanMedium",
  },
  sliderProgress: {
    flex: 3,
    height: "100%",
    borderRadius: 17,
    marginHorizontal: 8,
    position: "relative",
    overflow: "visible", // Changed to visible so avatars can extend beyond bounds
  },
  backgroundTrack: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "90%", // Background track covers 90% like the progress area
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
  avatarContainer: {
    position: "absolute",
    top: -15,
    width: 50,
    height: 50,
    zIndex: 10, // Increased z-index to bring avatars to front
  },
  leftAvatarContainer: {
    transform: [{ translateX: -32 }], // Center the avatar on its position
  },
  rightAvatarContainer: {},
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
  sliderControlContainer: {
    marginTop: 20,
    width: "80%",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 8,
    padding: 12,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  loadingText: {
    fontFamily: "GeneralSanMedium",
    fontSize: 16,
    color: "#737373",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  errorText: {
    fontFamily: "GeneralSanMedium",
    fontSize: 16,
    color: "#ff6b6b",
    textAlign: "center",
  },
  debugContainer: {
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  debugText: {
    fontFamily: "GeneralSanMedium",
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    marginBottom: 2,
  },
  switchButton: {
    backgroundColor: "#4785EA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    marginTop: 8,
  },
  switchButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "GeneralSanMedium",
    textAlign: "center",
  },
});
