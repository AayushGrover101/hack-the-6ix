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
          animation: 'simple_push',
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
        <Stack.Screen name="profilePage" />
      </Stack>
      <CustomTabBar profilePicture={require("@/assets/images/react-logo.png")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
