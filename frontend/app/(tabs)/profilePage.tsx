import { Image } from "expo-image";
import {
  Button,
  Platform,
  StyleSheet,
  Vibration,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Svg, { Path } from "react-native-svg";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";

interface ProfilePageProps {
  name?: string;
  email?: string;
  group?: string;
  photo?: any;
}

export default function TabTwoScreen({ 
  name = "Aayush", 
  email = "aayush@hackthenorth.com", 
  group = "75% HTN",
  photo 
}: ProfilePageProps) {
  const [editableName, setEditableName] = useState(name);
  const [editableEmail, setEditableEmail] = useState(email);
  const [editableGroup, setEditableGroup] = useState(group);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditPress = () => {
    if (isEditing) {
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditableName(name);
    setEditableEmail(email);
    setEditableGroup(group);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          title="my profile"
          imageSource={require("@/assets/images/profile/background.png")}
          icon={
            <Svg width={33} height={33} viewBox="0 0 30 30" fill="none">
              <Path
                d="M17.0885 21V19C17.0885 17.9391 16.667 16.9217 15.9169 16.1716C15.1667 15.4214 14.1493 15 13.0885 15H5.08846C4.02759 15 3.01017 15.4214 2.26003 16.1716C1.50988 16.9217 1.08846 17.9391 1.08846 19V21M23.0885 21V19C23.0878 18.1137 22.7928 17.2528 22.2498 16.5523C21.7068 15.8519 20.9466 15.3516 20.0885 15.13M16.0885 3.13C16.9489 3.3503 17.7115 3.8507 18.2561 4.55231C18.8007 5.25392 19.0963 6.11683 19.0963 7.005C19.0963 7.89317 18.8007 8.75608 18.2561 9.45769C17.7115 10.1593 16.9489 10.6597 16.0885 10.88M13.0885 7C13.0885 9.20914 11.2976 11 9.08846 11C6.87932 11 5.08846 9.20914 5.08846 7C5.08846 4.79086 6.87932 3 9.08846 3C11.2976 3 13.0885 4.79086 13.0885 7Z"
                stroke="#E88D4C"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          }
          color="#E88D4C"
        />
        <ThemedView style={styles.profileContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            {isEditing ? (
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 6L9 17L4 12"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            ) : (
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                  fill="#FFFFFF"
                />
              </Svg>
            )}
          </TouchableOpacity>

          {isEditing && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          )}

          <ThemedView style={styles.profileContent}>
            <ThemedView style={styles.profilePhoto}>
              <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="#E88D4C"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </ThemedView>

            <ThemedView style={styles.profileInfo}>
              <ThemedText style={styles.sectionLabel}>NAME</ThemedText>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editableName}
                  onChangeText={setEditableName}
                  placeholder="Enter name"
                />
              ) : (
                <ThemedText style={styles.sectionItem}>{editableName}</ThemedText>
              )}

              <ThemedText style={styles.sectionLabel}>EMAIL</ThemedText>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editableEmail}
                  onChangeText={setEditableEmail}
                  placeholder="Enter email"
                  keyboardType="email-address"
                />
              ) : (
                <ThemedText style={styles.sectionItem}>{editableEmail}</ThemedText>
              )}

              <ThemedText style={styles.sectionLabel}>
                BOOP GROUP NAME
              </ThemedText>
              {isEditing ? (
                <TextInput
                  style={styles.editInput}
                  value={editableGroup}
                  onChangeText={setEditableGroup}
                  placeholder="Enter group name"
                />
              ) : (
                <ThemedText style={styles.sectionItem}>{editableGroup}</ThemedText>
              )}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  editButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#E88D4C",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  cancelButton: {
    position: "absolute",
    top: 12,
    right: 52,
    backgroundColor: "#FF6B6B",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  sliderContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  slider: {
    width: "100%",
    height: 40,
    marginTop: 8,
  },
  profileContainer: {
    position: "relative",
    padding: 24,
    margin: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContent: {
    backgroundColor: "#fff",
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    borderWidth: 3,
    borderColor: "#E88D4C",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    width: "100%",
    backgroundColor: "#fff",
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "GeneralSanMedium",
    color: "#BBBBBB",
    marginBottom: 2,
    marginTop: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionItem: {
    fontSize: 16,
    fontFamily: "GeneralSanMedium",
    color: "#565656",
  },
  editInput: {
    fontSize: 16,
    fontFamily: "GeneralSanMedium",
    color: "#565656",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FAFAFA",
    marginBottom: 8,
  },
});
