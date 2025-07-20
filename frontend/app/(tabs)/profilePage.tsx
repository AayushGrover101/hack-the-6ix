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
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Svg, { Path } from "react-native-svg";
import { PageHeader } from "@/components/PageHeader";

export default function TabTwoScreen() {
  const handleEditPress = () => {
    console.log("Edit button pressed");
    // TODO: Add edit functionality
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                fill="#fff"
              />
            </Svg>
          </TouchableOpacity>
          
          <ThemedText>Profile Page</ThemedText>
        </ThemedView>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    padding: 16,
    margin: 24,
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    borderColor: "#E5E5E5",
    borderWidth: 1,
  },
});
