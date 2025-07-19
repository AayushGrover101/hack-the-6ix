import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import React from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginScreen from "@/components/LoginScreen";
import { ThemedText } from "@/components/ThemedText";

function AuthWrapper() {
  const { isLoading, isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText style={{ textAlign: 'center' }}>
          Loading...
        </ThemedText>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ItcKabelDemi: require("../assets/fonts/itc-kabel-std/ITCKabelStdDemi.ttf"),
    GeneralSanMedium: require("../assets/fonts/general-sans/GeneralSans-Medium.otf"),
    GeneralSanSemiBold: require("../assets/fonts/general-sans/GeneralSans-Semibold.otf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}
