import { useState, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  AppState,
  Button,
  Vibration,
  View,
  TextInput,
} from "react-native";
import { Image } from "expo-image";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { io, Socket } from "socket.io-client";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK_NAME = "background-location-task";
let sharedLocationCallback:
  | ((location: Location.LocationObject) => void)
  | null = null;

// Socket.IO connection
const SOCKET_URL = "https://hack-the-6ix.onrender.com"; // Deployed backend URL
// For local development, use one of these:
// const SOCKET_URL = "http://10.0.2.2:3000"; // Android emulator
// const SOCKET_URL = "http://localhost:3000"; // iOS simulator
// const SOCKET_URL = "http://YOUR_LOCAL_IP:3000"; // Physical device
let socket: Socket | null = null;

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
  const [detected, setDetected] = useState<boolean>(false);
  const [nearbyUser, setNearbyUser] = useState<any>(null);
  const [distance, setDistance] = useState<number>(0);
  const [userUid, setUserUid] = useState<string>("test-user-123"); // For testing - replace with actual user UID

  const [buzzDuration, setBuzzDuration] = useState(200);
  const [waitTime, setWaitTime] = useState(500);
  const intervalRef = useRef<number | null>(null);

  // Gradient state
  const [gradientIntensity, setGradientIntensity] = useState(50); // 0-100
  const [topGradientBlue, setTopGradientBlue] = useState(true); // true = #4785EA, false = #F06C6C

  // Slider state
  const [sliderValue, setSliderValue] = useState(0); // 0-100, represents progress percentage

  // Update slider value based on distance
  useEffect(() => {
    if (distance > 0 && distance <= 100) {
      // Inverse relationship: closer distance = higher slider value
      // 100m = 0%, 0m = 95% (max slider value)
      const newSliderValue = Math.max(0, 95 - (distance / 100) * 95);
      setSliderValue(newSliderValue);
    } else if (distance > 100) {
      setSliderValue(0);
    }
  }, [distance]);

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

  // Socket.IO connection setup
  useEffect(() => {
    // Initialize Socket.IO connection to receive proximity alerts
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      
      // Join user to their personal room for targeted messages
      socket?.emit('join_user_room', { uid: userUid });
    });

    socket.on('joined_user_room', (data) => {
      console.log('Joined user room:', data.uid);
    });

    socket.on('join_user_room_error', (data) => {
      console.error('Failed to join user room:', data.error);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      setDetected(false);
      setNearbyUser(null);
    });

    socket.on('proximity_alert', (data) => {
      console.log('Proximity alert received:', data);
      const { nearbyUser: user, distance: dist, canBoop } = data;
      
      setNearbyUser(user);
      setDistance(dist);
      
      // Set detected to true if user is within proximity range (100m)
      // This triggers the vibration and UI changes
      if (dist <= 100) {
        setDetected(true);
        console.log(`User detected nearby: ${user.name} at ${dist.toFixed(1)}m`);
      } else {
        setDetected(false);
      }
    });

    socket.on('boop_happened', (data) => {
      console.log('Boop happened:', data);
      // Handle boop event - could trigger special animations or sounds
    });

    socket.on('boop_success', (data) => {
      console.log('Boop success:', data);
      // Handle successful boop
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [userUid]);

  // Re-join room when userUid changes
  useEffect(() => {
    if (socket && socket.connected) {
      socket.emit('join_user_room', { uid: userUid });
    }
  }, [userUid]);

  // Send heartbeat to keep online status fresh
  useEffect(() => {
    if (socket && socket.connected && userUid) {
      const heartbeatInterval = setInterval(() => {
        socket.emit('heartbeat', { uid: userUid });
      }, 15000); // Send heartbeat every 15 seconds

      return () => {
        clearInterval(heartbeatInterval);
      };
    }
  }, [socket, userUid]);

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

      // Send location update to Socket.IO server
      if (socket && socket.connected) {
        socket.emit('update_location', {
          uid: userUid,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });
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
    };
  }, [appState, userUid]);

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
              getBottomGradientColor(gradientIntensity),
            ]}
            style={styles.gradientWrapper}
          >
            <View style={styles.profileCard}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={require("@/assets/images/boop-group/jesse-headshot.png")}
                  style={styles.profileImage}
                />
              </View>
              <View style={styles.profileInfo}>
                <ThemedText style={styles.profileName}>
                  {nearbyUser?.name || "Someone"}
                </ThemedText>
                <ThemedText style={styles.profileDistance}>
                  {distance > 0 ? `${Math.round(distance)}m` : "Nearby"}
                </ThemedText>
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

                  {/* Moving left avatar (current user) */}
                  <View
                    style={[
                      styles.avatarContainer,
                      styles.leftAvatarContainer,
                      { left: `${(sliderValue / 95) * 90}%` },
                    ]}
                  >
                    <Image
                      source={require("@/assets/images/boop-group/aayush-headshot.png")}
                      style={styles.sliderAvatar}
                    />
                  </View>

                  {/* Fixed right avatar (nearby user) */}
                  <View
                    style={[
                      styles.avatarContainer,
                      styles.rightAvatarContainer,
                      { left: "90%" },
                    ]}
                  >
                    <Image
                      source={require("@/assets/images/boop-group/jesse-headshot.png")}
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
                  onValueChange={(value) => {
                    setSliderValue(value);
                    // For testing: simulate distance based on slider value
                    if (value > 0) {
                      const simulatedDistance = 100 - (value / 95) * 100;
                      setDistance(simulatedDistance);
                      setDetected(simulatedDistance <= 100);
                    }
                  }}
                  minimumTrackTintColor="#4785EA"
                  maximumTrackTintColor="#d3d3d3"
                />
              </View>
            </View>
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
      
      {/* Testing Controls */}
      <View style={styles.testingContainer}>
        <ThemedText style={styles.testingLabel}>Testing User UID:</ThemedText>
        <TextInput
          style={styles.testingInput}
          value={userUid}
          onChangeText={setUserUid}
          placeholder="Enter user UID for testing"
          placeholderTextColor="#999"
        />
        <ThemedText style={styles.testingInfo}>
          Current: {userUid}
        </ThemedText>
        <ThemedText style={styles.testingInfo}>
          Socket: {socket?.connected ? "Connected" : "Disconnected"}
        </ThemedText>
        <ThemedText style={styles.testingInfo}>
          Detected: {detected ? "Yes" : "No"}
        </ThemedText>
        {nearbyUser && (
          <ThemedText style={styles.testingInfo}>
            Nearby: {nearbyUser.name} ({distance.toFixed(1)}m)
          </ThemedText>
        )}
      </View>
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
  testingContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 8,
    marginHorizontal: 16,
  },
  testingLabel: {
    fontSize: 16,
    fontFamily: "GeneralSanMedium",
    color: "#737373",
    marginBottom: 8,
  },
  testingInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    fontFamily: "GeneralSanMedium",
    color: "#333",
    marginBottom: 8,
  },
  testingInfo: {
    fontSize: 12,
    fontFamily: "GeneralSanMedium",
    color: "#666",
    marginBottom: 4,
  },
}); 