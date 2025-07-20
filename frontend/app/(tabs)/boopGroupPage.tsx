import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import Svg, { Path } from "react-native-svg";

import { PageHeader } from "@/components/PageHeader";
import { ThemedText } from "@/components/ThemedText";

export default function TabThreeScreen() {
  const [isDoNotDisturb, setIsDoNotDisturb] = React.useState(false);
  const insets = useSafeAreaInsets();

  const members = [
    {
      id: 1,
      name: "Aayush",
      boops: 15,
      isLeader: true,
      profilePhoto:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s",
    },
    {
      id: 2,
      name: "Jesse",
      boops: 2,
      isLeader: false,
      profilePhoto:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s",
    },
    {
      id: 3,
      name: "Weinna",
      boops: 5,
      isLeader: false,
      profilePhoto:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s",
    },
    {
      id: 4,
      name: "James",
      boops: 8,
      isLeader: false,
      profilePhoto:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4YreOWfDX3kK-QLAbAL4ufCPc84ol2MA8Xg&s",
    },
  ];

  const boopLogs = [
    {
      id: 1,
      user1: "Aayush",
      user2: "Weinna",
      date: "July 19, 2025",
      time: "2:39 PM",
      location: "York University",
    },
    {
      id: 2,
      user1: "Aayush",
      user2: "James",
      date: "July 19, 2025",
      time: "2:39 PM",
      location: "York University",
    },
    {
      id: 3,
      user1: "Aayush",
      user2: "Jesse",
      date: "July 19, 2025",
      time: "2:39 PM",
      location: "York University",
    },
    {
      id: 4,
      user1: "Weinna",
      user2: "James",
      date: "July 19, 2025",
      time: "2:39 PM",
      location: "York University",
    },
  ];

  // Helper function to get user data by ID
  const getUserById = (userId: number) => {
    return members.find(member => member.id === userId);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <PageHeader
          title="my boop group"
          imageSource={require("@/assets/images/boop-group/boop-group-header.png")}
          icon={
            <Svg width={33} height={33} viewBox="0 0 30 30" fill="none">
              <Path
                d="M17.0885 21V19C17.0885 17.9391 16.667 16.9217 15.9169 16.1716C15.1667 15.4214 14.1493 15 13.0885 15H5.08846C4.02759 15 3.01017 15.4214 2.26003 16.1716C1.50988 16.9217 1.08846 17.9391 1.08846 19V21M23.0885 21V19C23.0878 18.1137 22.7928 17.2528 22.2498 16.5523C21.7068 15.8519 20.9466 15.3516 20.0885 15.13M16.0885 3.13C16.9489 3.3503 17.7115 3.8507 18.2561 4.55231C18.8007 5.25392 19.0963 6.11683 19.0963 7.005C19.0963 7.89317 18.8007 8.75608 18.2561 9.45769C17.7115 10.1593 16.9489 10.6597 16.0885 10.88M13.0885 7C13.0885 9.20914 11.2976 11 9.08846 11C6.87932 11 5.08846 9.20914 5.08846 7C5.08846 4.79086 6.87932 3 9.08846 3C11.2976 3 13.0885 4.79086 13.0885 7Z"
                stroke="#A76CF0"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          }
          color="#A76CF0"
        />

        {/* Group Overview Section */}
        <View style={styles.groupOverview}>
          <View style={styles.groupInfo}>
            <View style={styles.groupNameContainer}>
              <ThemedText style={styles.groupName}>75% HTN</ThemedText>
              <TouchableOpacity style={styles.editButton}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                    stroke="#BBBBBB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M18.5 2.50023C18.8978 2.10297 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10297 21.5 2.50023C21.8978 2.89749 22.1218 3.43705 22.1218 3.99973C22.1218 4.56241 21.8978 5.10197 21.5 5.49923L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                    stroke="#BBBBBB"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.addButton]}
                activeOpacity={0.6}
              >
                <Svg width={20} height={20} viewBox="0 0 19 20" fill="none">
                  <Path
                    d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.884 12.5 9.99998 12.5H4.16665C3.28259 12.5 2.43474 12.8512 1.80962 13.4763C1.1845 14.1014 0.833313 14.9493 0.833313 15.8333V17.5M16.6666 6.66667V11.6667M19.1666 9.16667H14.1666M10.4166 5.83333C10.4166 7.67428 8.92426 9.16667 7.08331 9.16667C5.24236 9.16667 3.74998 7.67428 3.74998 5.83333C3.74998 3.99238 5.24236 2.5 7.08331 2.5C8.92426 2.5 10.4166 3.99238 10.4166 5.83333Z"
                    stroke="white"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.leaveButton]}
                activeOpacity={0.6}
              >
                <Svg width={24} height={24} viewBox="0 0 23 24" fill="none">
                  <Path
                    d="M15 7C16.1046 7 17 6.10457 17 5C17 3.89543 16.1046 3 15 3C13.8954 3 13 3.89543 13 5C13 6.10457 13.8954 7 15 7Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M12.6132 8.26697L9.30499 12.4022L13.4402 16.5374L11.3726 21.0862"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M6.4104 9.50753L9.79728 6.19934L12.6132 8.26695L15.508 11.5752H19.2297"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M8.89152 15.7103L7.65095 16.5374H4.34277"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Member List */}
        <View style={styles.memberList}>
          {members.map((member, index) => (
            <View key={member.id} style={[
              styles.memberItem,
              index === members.length - 1 && styles.lastMemberItem
            ]}>
              <View style={styles.memberAvatar}>
                <Image
                  source={{ uri: member.profilePhoto }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.memberInfo}>
                <ThemedText style={styles.memberName}>{member.name}</ThemedText>
                <View style={styles.boopCount}>
                  {member.isLeader && (
                    <Svg width={16} height={16} viewBox="0 0 18 18" fill="none">
                      <Path
                        d="M12.525 14.235H5.47503C5.16003 14.235 4.80753 13.9875 4.70253 13.6875L1.59753 5.00252C1.15503 3.75752 1.67253 3.37502 2.73753 4.14002L5.66253 6.23252C6.15003 6.57002 6.70503 6.39752 6.91503 5.85002L8.23503 2.33252C8.65503 1.20752 9.35253 1.20752 9.77253 2.33252L11.0925 5.85002C11.3025 6.39752 11.8575 6.57002 12.3375 6.23252L15.0825 4.27502C16.2525 3.43502 16.815 3.86252 16.335 5.22002L13.305 13.7025C13.1925 13.9875 12.84 14.235 12.525 14.235Z"
                        stroke="#E88D4C"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <Path
                        d="M4.875 16.5H13.125"
                        stroke="#E88D4C"
                        strokeWidth="1.125"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <Path
                        d="M7.125 10.5H10.875"
                        stroke="#E88D4C"
                        strokeWidth="1.125"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  )}
                  <ThemedText
                    style={[
                      styles.boopText,
                      member.isLeader && styles.leaderBoopText,
                    ]}
                  >
                    {member.boops} boops
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Do Not Disturb Toggle */}
        <View style={styles.doNotDisturbContainer}>
<<<<<<< HEAD
=======
          <ThemedText style={styles.doNotDisturbText}>
            Do not disturb
          </ThemedText>
>>>>>>> ac79a1a04e0a183d1207c7bdaaed4a266aa8b30d
          <Switch
            value={isDoNotDisturb}
            onValueChange={setIsDoNotDisturb}
            trackColor={{ false: "#E0E0E0", true: "#A76CF0" }}
            thumbColor={isDoNotDisturb ? "#FFFFFF" : "#FFFFFF"}
          />
          <ThemedText style={styles.doNotDisturbText}>Do not disturb</ThemedText>
        </View>

        {/* Boop Log Section */}
        <View style={styles.boopLogContainer}>
          <ThemedText style={styles.boopLogTitle}>boop log</ThemedText>
<<<<<<< HEAD
          {boopLogs.map((log) => {
            const user1 = getUserById(log.user1Id);
            const user2 = getUserById(log.user2Id);
            
            if (!user1 || !user2) return null;
            
            return (
              <BoopLogItem
                key={log.id}
                user1={user1}
                user2={user2}
                date={log.date}
                time={log.time}
                location={log.location}
              />
            );
          })}
=======
          {boopLogs.map((log) => (
            <View key={log.id} style={styles.boopLogItem}>
              <View style={styles.boopLogAvatars}>
                <View style={styles.avatarOverlap}>
                  <View style={[styles.logAvatar, styles.logAvatarBack]}>
                    <ThemedText style={styles.logAvatarText}>👨‍💻</ThemedText>
                  </View>
                  <View style={[styles.logAvatar, styles.logAvatarFront]}>
                    <ThemedText style={styles.logAvatarText}>👩‍💼</ThemedText>
                  </View>
                </View>
              </View>
              <View style={styles.boopLogContent}>
                <View style={styles.boopLogHeader}>
                  <ThemedText style={styles.boopLogDate}>{log.date}</ThemedText>
                  <ThemedText style={styles.boopLogTime}>{log.time}</ThemedText>
                </View>
                <ThemedText style={styles.boopLogDescription}>
                  {log.user1} and {log.user2} booped at{" "}
                  <ThemedText style={styles.boopLogLocation}>
                    {log.location}
                  </ThemedText>
                </ThemedText>
              </View>
            </View>
          ))}
>>>>>>> ac79a1a04e0a183d1207c7bdaaed4a266aa8b30d
        </View>
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

  groupOverview: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingVertical: 14,
  },
  groupInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  groupNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  groupName: {
    fontSize: 21,
<<<<<<< HEAD
    fontWeight: '700',
    color: '#A76CF0',
=======
    fontWeight: "500",
    color: "#A76CF0",
>>>>>>> ac79a1a04e0a183d1207c7bdaaed4a266aa8b30d
  },
  editButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#75CB47",
  },
  leaveButton: {
    backgroundColor: "#F06C6C",
  },
  memberList: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 6,
    borderRadius: 12,
    paddingVertical: 0,
    gap: 0,
    borderWidth: 2,
    borderColor: "rgba(187, 187, 187, 0.2)",
    borderStyle: "solid",
  },
  memberItem: {
<<<<<<< HEAD
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
=======
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingBottom: 16,
>>>>>>> ac79a1a04e0a183d1207c7bdaaed4a266aa8b30d
    borderBottomWidth: 1,
    borderBottomColor: "rgba(187, 187, 187, 0.2)",
  },
  lastMemberItem: {
    borderBottomWidth: 0,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    fontSize: 20,
  },
  memberInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333333",
  },
  boopCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  boopText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 2,
    color: "#bbbbbb",
  },
  leaderBoopText: {
    color: "#E88D4C",
  },
  doNotDisturbContainer: {
<<<<<<< HEAD
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
=======
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
>>>>>>> ac79a1a04e0a183d1207c7bdaaed4a266aa8b30d
  },
  doNotDisturbText: {
    fontSize: 16,
    color: "#333333",
  },
  boopLogContainer: {
    paddingHorizontal: 25,
    paddingRight: 35,
    paddingVertical: 16,
    marginTop: 16,
  },
  boopLogTitle: {
<<<<<<< HEAD
    fontSize: 21,
    fontWeight: '700',
    color: '#A76CF0',
    marginBottom: 12,
=======
    fontSize: 18,
    fontWeight: "600",
    color: "#A76CF0",
    marginBottom: 16,
  },
  boopLogItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  boopLogAvatars: {
    marginRight: 12,
  },
  avatarOverlap: {
    position: "relative",
    width: 40,
    height: 40,
  },
  logAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  logAvatarBack: {
    left: 0,
    top: 0,
    zIndex: 1,
  },
  logAvatarFront: {
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  logAvatarText: {
    fontSize: 14,
  },
  boopLogContent: {
    flex: 1,
  },
  boopLogHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  boopLogDate: {
    fontSize: 14,
    color: "#666666",
  },
  boopLogTime: {
    fontSize: 14,
    color: "#666666",
  },
  boopLogDescription: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  boopLogLocation: {
    fontSize: 14,
    color: "#2196F3",
    textDecorationLine: "underline",
>>>>>>> ac79a1a04e0a183d1207c7bdaaed4a266aa8b30d
  },
});
