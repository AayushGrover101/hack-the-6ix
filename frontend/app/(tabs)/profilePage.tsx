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
  photo = "https://media.licdn.com/dms/image/v2/D5603AQF6gPTl46j53w/profile-displayphoto-shrink_400_400/B56ZX4zDxuHQAk-/0/1743635890387?e=1755734400&v=beta&t=NyhNb_F72PO9N5KdJpaUjP7PNDpyQy8rlP1JLSTSK4c"
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
          imageSource={require("@/assets/images/profile/profile-group-header.png")}
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
              <Svg width={15} height={15} viewBox="0 0 22 25" fill="none">
                <Path 
                  d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" 
                  stroke="#ffffff" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <Path 
                  d="M18.5 2.50023C18.8978 2.10297 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10297 21.5 2.50023C21.8978 2.89749 22.1218 3.43705 22.1218 3.99973C22.1218 4.56241 21.8978 5.10197 21.5 5.49923L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" 
                  stroke="#ffffff" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
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
              {photo ? (
                <Image
                  source={{ uri: photo }}
                  style={styles.profileImage}
                  contentFit="cover"
                />
              ) : (
                <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    stroke="#E88D4C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
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
              <ThemedText style={styles.sectionItem}>{editableGroup}</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <TouchableOpacity style={styles.logoutButton}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" style={styles.logoutIcon}>
            <Path
              d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
              stroke="#F06C6C"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <ThemedText style={styles.logoutText}>Log out</ThemedText>
        </TouchableOpacity>
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
    top: 20,
    right: 20,
    backgroundColor: "#E88D4C",
    borderRadius: 20,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  cancelButton: {
    position: "absolute",
    top: 20,
    right: 60,
    backgroundColor: "#F06C6C",
    borderRadius: 20,
    width: 34,
    height: 34,
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
    borderWidth: 2,
    borderColor: 'rgba(187, 187, 187, 0.2)',
    borderStyle: 'solid',
  },
  profileContent: {
    backgroundColor: "#fff",
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "#E88D4C",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    width: 94,
    height: 94,
    borderRadius: 47,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD6D6',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
    alignSelf: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#F06C6C',
    fontSize: 16,
    fontWeight: '700',
  },
});
