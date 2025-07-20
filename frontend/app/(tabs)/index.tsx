import { StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import type { PropsWithChildren, ReactElement } from 'react';
import ReanimatedAnimated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { useUser } from "@/contexts/UserContext";

export default function TabThreeScreen() {
  const router = useRouter();
  const { user, switchUser } = useUser();
  
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoTranslateY = useRef(new Animated.Value(-50)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateX = useRef(new Animated.Value(-100)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateX = useRef(new Animated.Value(100)).current;

  const users = [
    { uid: 'user1', name: 'Alice Johnson', color: '#4785EA' },
    { uid: 'user2', name: 'Bob Smith', color: '#F06C6C' },
    { uid: 'user3', name: 'Charlie Brown', color: '#A76CF0' }
  ];

  const handleUserSelect = async (uid: string) => {
    await switchUser(uid);
    router.push("/boopPage");
  };

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
        {user && (
          <ThemedText style={styles.currentUser}>
            Current User: {user.name}
          </ThemedText>
        )}
      </Animated.View>
      
      {/* User Selection Buttons */}
      <Animated.View
        style={{
          opacity: buttonOpacity,
          transform: [{ translateX: buttonTranslateX }],
          width: '100%',
          paddingHorizontal: 40,
        }}
      >
        <ThemedText style={styles.selectUserTitle}>Select User:</ThemedText>
        {users.map((userOption) => (
          <TouchableOpacity
            key={userOption.uid}
            style={[
              styles.userButton,
              { 
                backgroundColor: userOption.color,
                borderColor: user?.uid === userOption.uid ? '#FFFFFF' : 'transparent',
                borderWidth: user?.uid === userOption.uid ? 3 : 0,
              }
            ]}
            onPress={() => handleUserSelect(userOption.uid)}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.userButtonText}>
              {userOption.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </Animated.View>
      
      <Animated.View
        style={{
          opacity: buttonOpacity,
          transform: [{ translateX: buttonTranslateX }],
          marginTop: 20,
        }}
      >
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push("/boopPage")}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.buttonText}>Continue to App</ThemedText>
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
  },
  currentUser: {
    fontFamily: "GeneralSanMedium",
    fontSize: 14,
    color: "#4785EA",
    textAlign: "center",
    marginTop: 8,
  },
  selectUserTitle: {
    fontFamily: "GeneralSanMedium",
    fontSize: 18,
    color: "#4785EA",
    textAlign: "center",
    marginBottom: 15,
  },
  userButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "GeneralSanMedium",
    textAlign: "center",
  },
});
