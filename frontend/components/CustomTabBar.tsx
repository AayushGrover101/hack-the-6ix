import React from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { ThemedText } from "./ThemedText";
import { useRouter, usePathname } from "expo-router";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";

interface TabItem {
  name: string;
  route: string;
  icon?: string;
  label: string;
  imagePath?: any; // For custom images
  color?: string; // For tab color
  backgroundColor?: string; // For active background color
}

interface CustomTabBarProps {
  profilePicture?: any; // Can be require() result or ImageSource
}

const tabs: TabItem[] = [
  {
    name: "boopGroupPage",
    route: "/boopGroupPage",
    label: "boop group",
    color: "#A76CF0",
    backgroundColor: "#F0E6FF",
    imagePath: require("@/assets/images/nav/boopGroup.svg"),
  },
  {
    name: "index",
    route: "/",
    label: "boop!",
    color: "#4785EA",
    backgroundColor: "#D6E1FF",
    imagePath: require("@/assets/images/nav/boop.svg"), 
  },
  {
    name: "profilePage",
    route: "/profilePage",
    label: "Profile",
    color: "#F06C6C",
    backgroundColor: "#FFD6D6",
  },
  // {
  //   name: 'testTab',
  //   route: '/testTab',
  //   icon: 'magnifyingglass',
  //   label: 'test',
  //   imagePath: require("@/assets/images/nav/boop.svg") // You can change this to a search icon
  // }
];

export default function CustomTabBar({ profilePicture }: CustomTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleTabPress = (route: string) => {
    console.log("Tab pressed:", route);
    try {
      router.push(route as any);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const isActiveTab = (route: string) => {
    if (route === "/") {
      return (
        pathname === "/" || pathname === "/(tabs)" || pathname === "/(tabs)/"
      );
    }
    return pathname.includes(route.replace("/", ""));
  };

  const TabBarContent = () => (
    <View
      style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 16) }]}
    >
      {tabs.map((tab, index) => {
        const isActive = isActiveTab(tab.route);
        return (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tabItem,
              isActive && { backgroundColor: tab.backgroundColor },
            ]}
            onPress={() => handleTabPress(tab.route)}
            activeOpacity={0.6}
          >
            <View style={styles.tabIconContainer}>
              <Image
                source={tab.imagePath ? tab.imagePath : profilePicture}
                style={{
                  width: 24,
                  height: 24,
                }}
                contentFit="contain"
                tintColor={isActive ? tab.color : "#737373"}
              />
            </View>
            {isActive && (
              <ThemedText style={[styles.tabLabel, { color: tab.color }]}>
                {tab.label}
              </ThemedText>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (Platform.OS === "ios") {
    return (
      <BlurView intensity={100} tint="extraLight" style={styles.blurContainer}>
        <View style={styles.iosTopBorder} />
        <TabBarContent />
      </BlurView>
    );
  }

  return (
    <View style={[styles.blurContainer, styles.androidBackground]}>
      <View style={styles.androidTopBorder} />
      <TabBarContent />
    </View>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  androidBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 16,
  },
  iosTopBorder: {
    height: 0.5,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  androidTopBorder: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 12,
    backgroundColor: "transparent",
  },
  tabItem: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    gap: 2,
  },
  tabIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeTabIconContainer: {
    backgroundColor: "#4785EA",
    shadowColor: "#4785EA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 16,
    fontFamily: "GeneralSanSemiBold",
    textAlign: "left",
  },
});
