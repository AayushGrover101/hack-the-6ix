import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';
import { useRouter, usePathname } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

interface TabItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

const tabs: TabItem[] = [
  {
    name: 'boopGroupPage',
    route: '/boopGroupPage',
    icon: 'person.2.fill',
    label: 'Group'
  },
  {
    name: 'index',
    route: '/',
    icon: 'house.fill',
    label: 'boop!'
  },
  {
    name: 'detectedPage',
    route: '/detectedPage',
    icon: 'paperplane.fill',
    label: 'Detected'
  },
  {
    name: 'testTab',
    route: '/testTab',
    icon: 'magnifyingglass',
    label: 'test'
  }
];

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const handleTabPress = (route: string) => {
    console.log('Tab pressed:', route);
    try {
      router.push(route as any);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const isActiveTab = (route: string) => {
    if (route === '/') {
      return pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/';
    }
    return pathname.includes(route.replace('/', ''));
  };

  const TabBarContent = () => (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {tabs.map((tab, index) => {
        const isActive = isActiveTab(tab.route);
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab.route)}
            activeOpacity={0.6}
          >
            <View style={[styles.tabIconContainer, isActive && styles.activeTabIconContainer]}>
              {tab.name === 'boopGroupPage' ? (
                <Image
                  source={require("@/assets/images/nav/boop.svg")}
                  style={{
                    width: 20,
                    height: 13,
                  }}
                  contentFit="contain"
                  tintColor={isActive ? '#FFFFFF' : '#737373'}
                />
              ) : (
                <IconSymbol
                  size={isActive ? 22 : 20}
                  name={tab.icon as any}
                  color={isActive ? '#FFFFFF' : '#737373'}
                />
              )}
            </View>
            <ThemedText 
              style={[
                styles.tabLabel, 
                isActive && styles.activeTabLabel
              ]}
            >
              {tab.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={100}
        tint="extraLight"
        style={styles.blurContainer}
      >
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  androidBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    shadowColor: '#000',
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  androidTopBorder: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 12,
    backgroundColor: 'transparent',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  activeTabIconContainer: {
    backgroundColor: '#4785EA',
    shadowColor: '#4785EA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'GeneralSanMedium',
    color: '#737373',
    textAlign: 'left',
  },
  activeTabLabel: {
    color: '#4785EA',
    fontWeight: '600',
    fontSize: 11,
  },
});
