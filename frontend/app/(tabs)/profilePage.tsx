import { Image } from "expo-image";
import { Button, Platform, StyleSheet, Vibration, Text, View } from "react-native";
import { useState, useEffect, useRef } from "react";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabTwoScreen() {

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Welcome to your profile page!</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>This is where you can manage your profile settings and preferences.</Text>
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  sliderContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: 8,
  },
});
