import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Magnetometer, Accelerometer } from 'expo-sensors';
import { CompassRose } from './CompassRose';

export const CompassHeading = () => {
  const [heading, setHeading] = useState(0);
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);
  const [accelSubscription, setAccelSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isPhoneFlat, setIsPhoneFlat] = useState(true);

  const _unsubscribe = useCallback(() => {
    subscription && subscription.remove();
    setSubscription(null);
    accelSubscription && accelSubscription.remove();
    setAccelSubscription(null);
  }, [subscription, accelSubscription]);

  const _subscribe = useCallback(() => {
    // Set update interval to 100ms for smooth updates
    Magnetometer.setUpdateInterval(100);
    Accelerometer.setUpdateInterval(100);
    
    // Subscribe to magnetometer
    const magSub = Magnetometer.addListener((data) => {
      setMagnetometerData(data);
      
      // Only update heading if phone is reasonably flat
      if (isPhoneFlat) {
        const heading = calculateHeading(data.x, data.y);
        setHeading(heading);
      }
    });
    
    // Subscribe to accelerometer to detect phone orientation
    const accelSub = Accelerometer.addListener((data) => {
      setAccelerometerData(data);
      
      // Check if phone is reasonably flat using accelerometer
      // When phone is flat, Z-axis should be close to -1g (pointing down due to gravity)
      // and X and Y should be close to 0
      const tiltMagnitude = Math.sqrt(data.x * data.x + data.y * data.y);
      
      // Consider phone "flat enough" if tilt is low (adjust threshold as needed)
      // Typical values: flat phone has tilt < 0.3, tilted phone > 0.5
      const isFlat = tiltMagnitude < 0.4 && Math.abs(data.z + 1.0) < 0.3;
      setIsPhoneFlat(isFlat);
    });
    
    setSubscription(magSub);
    setAccelSubscription(accelSub);
  }, [isPhoneFlat]);

  useEffect(() => {
    // Check if both magnetometer and accelerometer are available
    const checkAvailability = async () => {
      const magAvailable = await Magnetometer.isAvailableAsync();
      const accelAvailable = await Accelerometer.isAvailableAsync();
      const bothAvailable = magAvailable && accelAvailable;
      
      setIsAvailable(bothAvailable);
      if (bothAvailable) {
        _subscribe();
      }
    };

    checkAvailability();

    return () => _unsubscribe();
  }, [_subscribe, _unsubscribe]);

  // Calculate compass heading from magnetometer X and Y values
  const calculateHeading = (x: number, y: number) => {
    // Calculate angle in radians
    let angle = Math.atan2(y, x);
    
    // Convert to degrees
    let degrees = angle * (180 / Math.PI);
    
    // Normalize to 0-360 degrees
    degrees = (degrees + 360) % 360;
    
    // Adjust for magnetic declination if needed
    // (You might want to add magnetic declination correction based on location)
    
    return Math.round(degrees);
  };

  // Get cardinal direction from heading
  const getCardinalDirection = (heading: number) => {
    const directions = [
      'N', 'NNE', 'NE', 'ENE',
      'E', 'ESE', 'SE', 'SSE',
      'S', 'SSW', 'SW', 'WSW',
      'W', 'WNW', 'NW', 'NNW'
    ];
    
    const index = Math.round(heading / 22.5) % 16;
    return directions[index];
  };

  // Get more detailed direction description
  const getDirectionDescription = (heading: number) => {
    if (heading >= 337.5 || heading < 22.5) return 'North';
    if (heading >= 22.5 && heading < 67.5) return 'Northeast';
    if (heading >= 67.5 && heading < 112.5) return 'East';
    if (heading >= 112.5 && heading < 157.5) return 'Southeast';
    if (heading >= 157.5 && heading < 202.5) return 'South';
    if (heading >= 202.5 && heading < 247.5) return 'Southwest';
    if (heading >= 247.5 && heading < 292.5) return 'West';
    if (heading >= 292.5 && heading < 337.5) return 'Northwest';
    return 'Unknown';
  };

  if (!isAvailable) {
    return (
      <View style={styles.container}>
        <Text style={styles.unavailable}>
          📱 Magnetometer or Accelerometer not available
        </Text>
        <Text style={styles.note}>
          Compass heading requires both magnetometer and accelerometer sensors
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Phone Orientation Status
      <View style={[styles.statusContainer, { backgroundColor: isPhoneFlat ? '#e8f5e8' : '#fff3e0' }]}>
        <Text style={[styles.statusText, { color: isPhoneFlat ? '#2e7d32' : '#f57c00' }]}>
          {isPhoneFlat ? '📱 Phone Stable' : '📱 Phone Moving'}
        </Text>
        <Text style={styles.statusSubtext}>
          {isPhoneFlat ? 'Compass reading is accurate' : 'Hold phone steady for better accuracy'}
        </Text>
      </View> */}
      
      {/* Visual Compass Rose */}
      <CompassRose heading={heading} size={180} />
{/*       
      <View style={styles.compassContainer}>
        <Text style={styles.heading}>{heading}°</Text>
        <Text style={styles.direction}>{getCardinalDirection(heading)}</Text>
        <Text style={styles.description}>{getDirectionDescription(heading)}</Text>
      </View> */}
      
      <View style={styles.rawData}>
        <Text style={styles.rawTitle}>📊 Magnetometer Data:</Text>
        <Text style={styles.rawText}>X: {magnetometerData.x.toFixed(2)}</Text>
        <Text style={styles.rawText}>Y: {magnetometerData.y.toFixed(2)}</Text>
        <Text style={styles.rawText}>Z: {magnetometerData.z.toFixed(2)}</Text>
      </View>

      <View style={styles.rawData}>
        <Text style={styles.rawTitle}>� Accelerometer Data (g):</Text>
        <Text style={styles.rawText}>X: {accelerometerData.x.toFixed(3)}</Text>
        <Text style={styles.rawText}>Y: {accelerometerData.y.toFixed(3)}</Text>
        <Text style={styles.rawText}>Z: {accelerometerData.z.toFixed(3)}</Text>
      </View>

      <Text style={styles.note}>
        🧭 Phone top pointing: {getDirectionDescription(heading)}
      </Text>
      <Text style={styles.calibration}>
        💡 Hold phone flat and steady for accurate compass readings
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    minWidth: 250,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  statusSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  compassContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    minWidth: 200,
  },
  heading: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  direction: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 18,
    color: '#666',
  },
  rawData: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    minWidth: 200,
  },
  rawTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  rawText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  note: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  calibration: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  unavailable: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10,
  },
});
