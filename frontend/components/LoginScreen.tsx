import React from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image } from "expo-image";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Login Failed", "Please try again.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/nav/boop.svg")}
            style={styles.logo}
            contentFit="contain"
          />
          <ThemedText style={styles.appName}>boop!</ThemedText>
          <ThemedText style={styles.tagline}>
            Connect with people nearby
          </ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.loginButton]}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.loginButtonText}>
              {"Sign In with Auth0"}
            </ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.disclaimer}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  appName: {
    fontSize: 48,
    fontFamily: "ItcKabelDemi",
    marginBottom: 12,
    color: "#4785EA",
  },
  tagline: {
    fontSize: 18,
    fontFamily: "GeneralSanMedium",
    textAlign: "center",
    opacity: 0.7,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#4785EA",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#4785EA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "GeneralSanSemiBold",
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: "GeneralSanMedium",
    textAlign: "center",
    opacity: 0.6,
    lineHeight: 16,
  },
});
