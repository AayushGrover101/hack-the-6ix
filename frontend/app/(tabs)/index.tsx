import { Image } from 'expo-image';
import { useState, useEffect } from 'react';
import { Platform, StyleSheet, AppState } from 'react-native';

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
  const [currLocation, setCurrLocation] = useState<Location.LocationObject | null>(null);

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
    sharedLocationCallback = (location: Location.LocationObject) => {
      setCurrLocation(location);
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
        // make sure bro has permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Foreground permission denied');
          return;
        }

        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          console.log('Background permission denied');
          return;
        }

        try {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
          console.log('Stopped existing location updates');
        } catch {
          console.log('No existing location updates to stop');
        }

        const locationConfig = {
          accuracy: appState === 'active' 
            ? Location.Accuracy.Highest 
            : Location.Accuracy.Balanced,
          timeInterval: appState === 'active' ? 1000 : 30000,
          distanceInterval: appState === 'active' ? 0 : 2,

          deferredUpdatesInterval: undefined,
          deferredUpdatesDistance: undefined,
          
          ...(appState !== 'background' && {
            foregroundService: {
              notificationTitle: 'Location tracking',
              notificationBody: 'App is tracking your location',
            },
          }),
        };

        console.log(`Setting up location tracking with config for appState '${appState}':`, locationConfig);

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, locationConfig);

        console.log('Location tracking started successfully');
      } catch (error) {
        console.error('Error setting up location:', error);
        
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('foreground service') || errorMessage.includes('background')) {
          console.log('Retrying without foreground service...');
          try {
            const fallbackConfig = {
              accuracy: appState === 'active' 
                ? Location.Accuracy.Highest 
                : Location.Accuracy.Balanced,
              timeInterval: appState === 'active' ? 1000 : 30000, // 1s foreground, 30s background
              distanceInterval: appState === 'active' ? 0 : 5,
              deferredUpdatesInterval: undefined, 
              deferredUpdatesDistance: undefined,
            };
            
            await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, fallbackConfig);
            console.log('Location tracking started with fallback config');
          } catch (fallbackError) {
            console.error('Fallback location setup also failed:', fallbackError);
          }
        }
      }
    };

    setupLocation();

    return () => {
      sharedLocationCallback = null;
      Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME).catch(console.error);
    };
  }, [appState]);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setCurrLocation(location);
        console.log('Initial current location:', location);
      } catch (error) {
        console.error('Error getting current location:', error);
      }
    };

    getCurrentLocation();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>boop!</ThemedText>
      <ThemedText style={styles.status}>
        App State: {appState}
      </ThemedText>
      <ThemedText style={styles.info}>
        {currLocation?.coords.latitude?.toFixed(6)}, {currLocation?.coords.longitude?.toFixed(6)}
      </ThemedText>
      <ThemedText style={styles.info}>
        {appState === 'active' 
          ? 'Tracking: Every 1s (foreground)' 
          : 'Tracking: Every 30s or 2m (background)'}
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
