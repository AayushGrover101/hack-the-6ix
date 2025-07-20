import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import CustomTabBar from "@/components/CustomTabBar";

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar since we have custom one
        }}
        tabBar={() => <CustomTabBar profilePicture={require("@/assets/images/react-logo.png")} />}
      >
        <Tabs.Screen 
          name="boopPage" 
          options={{ 
            title: 'boop!'
          }}
        />
        <Tabs.Screen 
          name="boopGroupPage"
          options={{ 
            title: 'Group'
          }}
        />
        <Tabs.Screen 
          name="profilePage"
          options={{ 
            title: 'Profile'
          }}
        />
        <Tabs.Screen 
          name="index" 
          options={{ 
            title: 'bingbong'
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
