import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Platform, StyleSheet, AppState, Button } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';
let sharedLocationCallback: ((location: Location.LocationObject) => void) | null = null;

// location task for background updates
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
  if (error) {
    console.error('Background location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] Background location task received ${locations?.length} locations`);
    
    if (locations && locations.length > 0 && sharedLocationCallback) {
      const callback = sharedLocationCallback;
      callback(locations[0]);
    }
  }
});

export default function HomeScreen() {
  const [appState, setAppState] = useState(AppState.currentState);
  const [currTestLocation, setCurrTestLocation] = useState<Location.LocationObject | null>(null);
  const [detected, setDetected] = useState<boolean>(false); // TODO: make this a context or global state or smth
  // const [toggleDND, setToggleDND] = useState<boolean>(false);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: typeof AppState.currentState) => {
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    let cleanupInterval: any;
    
    sharedLocationCallback = (location: Location.LocationObject) => {
      setCurrTestLocation(location);
      const timestamp = new Date().toLocaleTimeString();
      const mode = appState === 'active' ? 'FOREGROUND' : 'BACKGROUND';
      console.log(`[${timestamp}] ${mode} Location updated:`, {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp
      });
    };

    const setupLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Foreground permission denied');
          return;
        }

        if (Platform.OS !== 'ios') {
          try {
            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus !== 'granted') {
              console.log('Background permission denied on Android');
            }
          } catch (bgError) {
            console.log('Background permission request failed on Android:', bgError);
          }
        } else {
          console.log('Skipping background permissions on iOS (Expo Go limitation)');
        }

        try {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
          console.log('Stopped existing location updates');
        } catch {
          console.log('No existing location updates to stop');
        }

        const locationConfig = {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // CHANGE FOR ACTUAL REALISTIC STUFF
          distanceInterval: 0, // also this
        };

        console.log(`Setting up location tracking for ${Platform.OS}:`, locationConfig);

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, locationConfig);

        console.log('Location tracking started successfully');
      } catch (error) {
        console.error('Error setting up location:', error);
        
        // Fallback to basic location tracking
        console.log('Trying fallback location setup...');
        try {
          const fallbackConfig = {
            accuracy: Location.Accuracy.High,
            timeInterval: Platform.OS === 'ios' ? 3000 : 1000,
            distanceInterval: 2,
          };
          
          await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, fallbackConfig);
          console.log('Location tracking started with fallback config');
        } catch (fallbackError) {
          console.error('Fallback location setup also failed:', fallbackError);
          
          // Final fallback: Use simple periodic getCurrentPosition (no background task)
          console.log('Using periodic getCurrentPosition as final fallback...');
          
          const periodicLocationFetch = () => {
            Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            }).then((location) => {
              if (sharedLocationCallback) {
                sharedLocationCallback(location);
              }
            }).catch((getCurrentError) => {
              console.log('getCurrentPosition failed:', getCurrentError);
            });
          };
          
          // Get location immediately
          periodicLocationFetch();
          
          // Then every 3 seconds for faster updates
          cleanupInterval = setInterval(periodicLocationFetch, 3000);
        }
      }
    };

    const setupLocationWrapper = async () => {
      try {
        await setupLocation();
      } catch {
        // If setupLocation fails completely, use our own periodic fetching
        console.log('All location methods failed, using basic periodic fetching...');
        
        const periodicLocationFetch = () => {
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          }).then((location) => {
            if (sharedLocationCallback) {
              sharedLocationCallback(location);
            }
          }).catch((getCurrentError) => {
            console.log('getCurrentPosition failed:', getCurrentError);
          });
        };
        
        // Get location immediately
        periodicLocationFetch();
        
        // Then every 3 seconds for faster updates
        cleanupInterval = setInterval(periodicLocationFetch, 3000);
      }
    };

    setupLocationWrapper();

    return () => {
      sharedLocationCallback = null;
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(console.error);
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
      }
    };
  }, [appState]);

  // Get initial location for immediate display
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setCurrTestLocation(location);
        console.log('Initial current location:', location);
      } catch (error) {
        console.error('Error getting current location:', error);
      }
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (detected) {
      router.push('/(tabs)/detectedPage');
    }
  }, [detected]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>boop!</ThemedText>
      <Button onPress={() => setDetected(true)} title="Go to Detected Page" />
      <ThemedText style={styles.status}>
        App State: {appState}
      </ThemedText>
      <ThemedText style={styles.info}>
        {currTestLocation?.coords.latitude?.toFixed(6)}, {currTestLocation?.coords.longitude?.toFixed(6)}
      </ThemedText>
      <ThemedText style={styles.info}>
        Tracking: Every {Platform.OS === 'ios' ? '2s or 1m' : '3s or 3m'} ({Platform.OS === 'ios' ? 'iOS foreground only' : 'Android with background'})
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  title : {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  }
});
