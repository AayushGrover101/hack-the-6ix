import React from "react";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface CompassProps {
  profileImageUrl: string;
  rotation: number; // 0-360 degrees
  size?: number; // Optional size prop, defaults to 140
}

export default function Compass({ profileImageUrl, rotation, size = 140 }: CompassProps) {
  const arrowSize = (size * 233) / 140; // Scale arrow proportionally
  const arrowOffset = (arrowSize - size) / 2; // Center the arrow over the profile image

  return (
    <View style={[styles.profileImageContainer, { width: size, height: size }]}>
      <Image
        source={profileImageUrl}
        style={[styles.profileImage, { width: size, height: size, borderRadius: size / 2 }]}
      />
      <Image
        source={require("@/assets/images/boop/arrow.png")}
        style={[
          styles.arrowOverlay,
          {
            width: arrowSize,
            height: arrowSize,
            top: -arrowOffset,
            left: -arrowOffset,
            transform: [{ rotate: `${rotation}deg` }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileImageContainer: {
    marginRight: 16,
    borderRadius: 100,
    borderColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    position: "relative",
  },
  profileImage: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  arrowOverlay: {
    position: "absolute",
    zIndex: 10,
  },
}); 