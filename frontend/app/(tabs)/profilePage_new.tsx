import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity, Alert, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#F06C6C", dark: "#FFD6D6" }}
      headerImage={
        <View style={styles.headerImageContainer}>
          {user?.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profileImage}
              contentFit="cover"
            />
          ) : (
            <View style={styles.defaultProfileImage}>
              <ThemedText style={styles.profileInitial}>
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </ThemedText>
            </View>
          )}
        </View>
      }
    >
      <ThemedView style={styles.container}>
        <View style={styles.userInfoSection}>
          <ThemedText style={styles.userName}>{user?.name || "User"}</ThemedText>
          <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
          
          {user?.groupId && (
            <View style={styles.groupInfo}>
              <ThemedText style={styles.groupLabel}>Group ID:</ThemedText>
              <ThemedText style={styles.groupId}>{user.groupId}</ThemedText>
            </View>
          )}
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.logoutButtonText}>
              {isLoading ? "Signing Out..." : "Sign Out"}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.appInfo}>
          <ThemedText style={styles.appInfoTitle}>About boop!</ThemedText>
          <ThemedText style={styles.appInfoText}>
            Connect with people nearby and discover who&apos;s around you.
          </ThemedText>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
  },
  defaultProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F06C6C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  profileInitial: {
    fontSize: 48,
    fontFamily: 'ItcKabelDemi',
    color: 'white',
  },
  container: {
    padding: 20,
  },
  userInfoSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  userName: {
    fontSize: 28,
    fontFamily: 'ItcKabelDemi',
    marginBottom: 8,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'GeneralSanMedium',
    opacity: 0.7,
    textAlign: 'center',
  },
  groupInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  groupLabel: {
    fontSize: 14,
    fontFamily: 'GeneralSanMedium',
    opacity: 0.7,
  },
  groupId: {
    fontSize: 16,
    fontFamily: 'GeneralSanSemiBold',
    marginTop: 4,
  },
  actionsSection: {
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#F06C6C',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#F06C6C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'GeneralSanSemiBold',
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  appInfoTitle: {
    fontSize: 20,
    fontFamily: 'ItcKabelDemi',
    marginBottom: 8,
  },
  appInfoText: {
    fontSize: 16,
    fontFamily: 'GeneralSanMedium',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
});
