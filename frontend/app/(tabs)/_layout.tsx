import { Stack } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomTabBar from "@/components/CustomTabBar";

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            gestureEnabled: false
          }}
        />
        <Stack.Screen name="boopGroupPage" />
        <Stack.Screen name="detectedPage" />
        <Stack.Screen name="testTab" />
      </Stack>
      <CustomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
