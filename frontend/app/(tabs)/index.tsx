import { StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function TabThreeScreen() {
  const router = useRouter();
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(-50)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateX = useRef(new Animated.Value(-100)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateX = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    // Start animations sequence
    const animateSequence = () => {
      // Logo drop and pop animation
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(logoTranslateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Title slide in from left (delayed)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(titleTranslateX, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }, 300);

      // Button slide in from right (more delayed)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(buttonTranslateX, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start();
      }, 600);
    };

    animateSequence();
  }, [logoScale, logoTranslateY, titleOpacity, titleTranslateX, buttonOpacity, buttonTranslateX]);

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("../../assets/images/login/loginTop.png")}
        style={styles.topImage}
      />
      <Image
        source={require("../../assets/images/login/loginBottom.png")}
        style={styles.bottomImage}
      />
      <Animated.Image
        source={require("../../assets/images/login/loginLogo.png")}
        style={[
          styles.image,
          {
            transform: [
              { scale: logoScale },
              { translateY: logoTranslateY }
            ],
          },
        ]}
      />
      <Animated.View
        style={{
          opacity: titleOpacity,
          transform: [{ translateX: titleTranslateX }],
        }}
      >
        <ThemedText style={styles.title}>boop your friends!</ThemedText>
      </Animated.View>
      <Animated.View
        style={{
          opacity: buttonOpacity,
          transform: [{ translateX: buttonTranslateX }],
        }}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push("/boopPage")}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.buttonText}>Sign in with google!</ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: "#FBFBFB",
  },
  image: {
    width: 270,
    objectFit: "contain",
  },
  title: {
    fontFamily: "GeneralSanMedium",
    fontSize: 24,
    color: "#8B8B8B",
    gap: 8,
  },
  topImage: {
    position: "absolute",
    top: 0,
    width: "100%",
  },
  bottomImage: {
    position: "absolute",
    bottom: 0,
  },
  button: {
    backgroundColor: "#4785EA",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "GeneralSanMedium",
    textAlign: "center",
  }
});
