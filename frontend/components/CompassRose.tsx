import React from 'react';
import { View, StyleSheet } from 'react-native';

type CompassRoseProps = {
  heading: number;
  size?: number;
};

export const CompassRose: React.FC<CompassRoseProps> = ({ 
  heading, 
  size = 150 
}) => {
  const radius = size / 2;
  const center = size / 2;

  const cardinalDirections = [
    { angle: 0, label: 'N', isCardinal: true },
    { angle: 45, label: 'NE', isCardinal: false },
    { angle: 90, label: 'E', isCardinal: true },
    { angle: 135, label: 'SE', isCardinal: false },
    { angle: 180, label: 'S', isCardinal: true },
    { angle: 225, label: 'SW', isCardinal: false },
    { angle: 270, label: 'W', isCardinal: true },
    { angle: 315, label: 'NW', isCardinal: false },
  ];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.outerCircle, { width: size, height: size, borderRadius: radius }]} />
      
      {cardinalDirections.map((direction) => {
        const angleRad = (direction.angle * Math.PI) / 180;
        const markerRadius = radius - 20;
        const x = center + markerRadius * Math.sin(angleRad);
        const y = center - markerRadius * Math.cos(angleRad);
        
        return (
          <View
            key={direction.angle}
            style={[
              styles.directionMarker,
              direction.isCardinal ? styles.cardinalMarker : styles.intercardinalMarker,
              {
                left: x - 10,
                top: y - 10,
              },
            ]}
          >
          </View>
        );
      })}
      
      <View
        style={[
          styles.phoneIndicator,
          {
            transform: [{ rotate: `${heading}deg` }],
            left: center - 2,
            top: 20,
          },
        ]}
      />
      
      <View
        style={[
          styles.centerDot,
          {
            left: center - 5,
            top: center - 5,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    margin: 10,
  },
  outerCircle: {
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    position: 'absolute',
  },
  directionMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  cardinalMarker: {
    backgroundColor: '#007AFF',
  },
  intercardinalMarker: {
    backgroundColor: '#8E8E93',
  },
  phoneIndicator: {
    position: 'absolute',
    width: 4,
    height: 60,
    backgroundColor: '#FF3B30',
    borderRadius: 2,
  },
  centerDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
  },
});
