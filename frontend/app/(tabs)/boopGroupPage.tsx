import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageHeader } from '@/components/PageHeader';
import { ThemedText } from '@/components/ThemedText';
import { BoopLogItem } from '@/components/BoopLogItem';
import { InviteModal } from '@/components/InviteModal';
import { LeaveGroupModal } from '@/components/LeaveGroupModal';
import { CreateGroupModal } from '@/components/CreateGroupModal';
import { JoinGroupModal } from '@/components/JoinGroupModal';

interface TabThreeScreenProps {
  hasGroup?: boolean;
}

// Component for when user doesn't have a group
const NoGroupView = () => {
  const insets = useSafeAreaInsets();
  const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
  const [isJoinModalVisible, setIsJoinModalVisible] = React.useState(false);

  const handleCreateGroup = () => {
    setIsCreateModalVisible(true);
  };

  const handleJoinGroup = () => {
    setIsJoinModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalVisible(false);
  };

  const handleCloseJoinModal = () => {
    setIsJoinModalVisible(false);
  };

  const handleCreateGroupSubmit = (groupName: string) => {
    // TODO: Implement create group functionality
    console.log('Creating new group:', groupName);
  };

  const handleJoinGroupSubmit = (inviteCode: string) => {
    // TODO: Implement join group functionality
    console.log('Joining group with code:', inviteCode);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 16) + 50,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <PageHeader title="my boop group" color="#A76CF0" imageSource={require('@/assets/images/boop-group/boop-group-header.png')} icon={<Svg width={33} height={33} viewBox="0 0 30 30" fill="none">
          <Path 
            d="M17.0885 21V19C17.0885 17.9391 16.667 16.9217 15.9169 16.1716C15.1667 15.4214 14.1493 15 13.0885 15H5.08846C4.02759 15 3.01017 15.4214 2.26003 16.1716C1.50988 16.9217 1.08846 17.9391 1.08846 19V21M23.0885 21V19C23.0878 18.1137 22.7928 17.2528 22.2498 16.5523C21.7068 15.8519 20.9466 15.3516 20.0885 15.13M16.0885 3.13C16.9489 3.3503 17.7115 3.8507 18.2561 4.55231C18.8007 5.25392 19.0963 6.11683 19.0963 7.005C19.0963 7.89317 18.8007 8.75608 18.2561 9.45769C17.7115 10.1593 16.9489 10.6597 16.0885 10.88M13.0885 7C13.0885 9.20914 11.2976 11 9.08846 11C6.87932 11 5.08846 9.20914 5.08846 7C5.08846 4.79086 6.87932 3 9.08846 3C11.2976 3 13.0885 4.79086 13.0885 7Z" 
            stroke="#A76CF0" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </Svg>} />

        {/* No Group Content */}
        <View style={styles.noGroupContainer}>
          <View style={styles.noGroupCard}>
            <ThemedText style={styles.noGroupMessage}>You don&apos;t have a boop group yet!</ThemedText>
            
            <View style={styles.noGroupButtons}>
              <TouchableOpacity 
                style={[styles.noGroupButton, styles.createButton]} 
                activeOpacity={0.6}
                onPress={handleCreateGroup}
              >
                <View style={styles.buttonContent}>
                  <View style={[styles.buttonIcon, styles.createButtonIcon]}>
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      <Path 
                        d="M12 5V19M5 12H19" 
                        stroke="#75CB47" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                  <ThemedText style={[styles.buttonText, styles.createButtonText]}>Create new boop group</ThemedText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.noGroupButton, styles.joinButton]} 
                activeOpacity={0.6}
                onPress={handleJoinGroup}
              >
                <View style={styles.buttonContent}>
                  <View style={[styles.buttonIcon, styles.joinButtonIcon]}>
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      <Path 
                        d="M12 5V19M5 12H19" 
                        stroke="#4785EA" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                  <ThemedText style={[styles.buttonText, styles.joinButtonText]}>Join existing boop group</ThemedText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Create Group Modal */}
      <CreateGroupModal
        visible={isCreateModalVisible}
        onClose={handleCloseCreateModal}
        onCreateGroup={handleCreateGroupSubmit}
      />

      {/* Join Group Modal */}
      <JoinGroupModal
        visible={isJoinModalVisible}
        onClose={handleCloseJoinModal}
        onJoinGroup={handleJoinGroupSubmit}
      />
    </View>
  );
};

// Component for when user has a group (existing content)
const HasGroupView = () => {
  const [isDoNotDisturb, setIsDoNotDisturb] = React.useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = React.useState(false);
  const [isLeaveModalVisible, setIsLeaveModalVisible] = React.useState(false);
  const insets = useSafeAreaInsets();

  const members = [
    { id: 1, name: 'Aayush', boops: 15, isLeader: true, profilePhoto: 'https://media.discordapp.net/attachments/1316937625369841767/1396338293179678730/aayush-headshot.png?ex=687db8df&is=687c675f&hm=bc5be7250136b230632e1872f85b34e49fe861fd4adb9fd02b232934e34acc23&=&format=webp&quality=lossless&width=84&height=84' },
    { id: 2, name: 'Jesse', boops: 2, isLeader: false, profilePhoto: 'https://media.discordapp.net/attachments/1316937625369841767/1396338293658091662/jesse-headshot.png?ex=687db8df&is=687c675f&hm=5a836c72519689953d0a3aa599e44c69b62ab522ea42e1f8470be688fe1026d0&=&format=webp&quality=lossless&width=84&height=84' },
    { id: 3, name: 'Weinna', boops: 5, isLeader: false, profilePhoto: 'https://media.discordapp.net/attachments/1316937625369841767/1396338294089842758/weinna-headshot.png?ex=687db8e0&is=687c6760&hm=e360988c00b55a8d73de0be981ac9c286560d35fba8b344ee7f52c86136294b8&=&format=webp&quality=lossless&width=84&height=84' },
    { id: 4, name: 'James', boops: 8, isLeader: false, profilePhoto: 'https://media.discordapp.net/attachments/1316937625369841767/1396338293444051084/james-headshot.png?ex=687db8df&is=687c675f&hm=fff7088a303634f1f1a9c062c6bc35aedddddb1ab64d4a5b46f62942ad8631e0&=&format=webp&quality=lossless&width=84&height=84' },
  ];

  const boopLogs = [
    { 
      id: 4, 
      user1Id: 3, 
      user2Id: 4, 
      date: 'July 19, 2025', 
      time: '2:39 PM', 
      location: 'York University' 
    },
    { 
      id: 3, 
      user1Id: 1, 
      user2Id: 2, 
      date: 'July 19, 2025', 
      time: '2:39 PM', 
      location: 'York University' 
    },
    { 
      id: 2,  
      user1Id: 1, 
      user2Id: 4, 
      date: 'July 19, 2025', 
      time: '2:39 PM', 
      location: 'York University' 
    },
    { 
      id: 1, 
      user1Id: 1, 
      user2Id: 3, 
      date: 'July 19, 2025', 
      time: '2:39 PM', 
      location: 'York University' 
    },
  ];

  // Helper function to get user data by ID
  const getUserById = (userId: number) => {
    return members.find(member => member.id === userId);
  };

  const handleAddButtonPress = () => {
    setIsInviteModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsInviteModalVisible(false);
  };

  const handleLeaveButtonPress = () => {
    setIsLeaveModalVisible(true);
  };

  const handleCloseLeaveModal = () => {
    setIsLeaveModalVisible(false);
  };

  const handleLeaveGroup = () => {
    // TODO: Implement leave group functionality
    console.log('Leaving group...');
    // You can add navigation logic here to go back to home or show a different screen
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 16) + 50, // Add extra padding for tab bar
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <PageHeader title="my boop group" color="#A76CF0" imageSource={require('@/assets/images/boop-group/boop-group-header.png')} icon={<Svg width={33} height={33} viewBox="0 0 30 30" fill="none">
          <Path 
            d="M17.0885 21V19C17.0885 17.9391 16.667 16.9217 15.9169 16.1716C15.1667 15.4214 14.1493 15 13.0885 15H5.08846C4.02759 15 3.01017 15.4214 2.26003 16.1716C1.50988 16.9217 1.08846 17.9391 1.08846 19V21M23.0885 21V19C23.0878 18.1137 22.7928 17.2528 22.2498 16.5523C21.7068 15.8519 20.9466 15.3516 20.0885 15.13M16.0885 3.13C16.9489 3.3503 17.7115 3.8507 18.2561 4.55231C18.8007 5.25392 19.0963 6.11683 19.0963 7.005C19.0963 7.89317 18.8007 8.75608 18.2561 9.45769C17.7115 10.1593 16.9489 10.6597 16.0885 10.88M13.0885 7C13.0885 9.20914 11.2976 11 9.08846 11C6.87932 11 5.08846 9.20914 5.08846 7C5.08846 4.79086 6.87932 3 9.08846 3C11.2976 3 13.0885 4.79086 13.0885 7Z" 
            stroke="#A76CF0" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </Svg>} />

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
                onPress={handleAddButtonPress}
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
                onPress={handleLeaveButtonPress}
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
                  <ThemedText style={[styles.boopText, member.isLeader && styles.leaderBoopText]}>{member.boops} boops</ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Do Not Disturb Toggle */}
        <View style={styles.doNotDisturbContainer}>
          <Switch
            value={isDoNotDisturb}
            onValueChange={setIsDoNotDisturb}
            trackColor={{ false: '#E0E0E0', true: '#A76CF0' }}
            thumbColor={isDoNotDisturb ? '#FFFFFF' : '#FFFFFF'}
          />
          <ThemedText style={styles.doNotDisturbText}>Do not disturb</ThemedText>
        </View>

        {/* Boop Log Section */}
        <View style={styles.boopLogContainer}>
          <ThemedText style={styles.boopLogTitle}>boop log</ThemedText>
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
        </View>
      </ScrollView>

      {/* Invite Modal */}
      <InviteModal
        visible={isInviteModalVisible}
        onClose={handleCloseModal}
        inviteCode="6YFU78R"
      />

      {/* Leave Group Modal */}
      <LeaveGroupModal
        visible={isLeaveModalVisible}
        onClose={handleCloseLeaveModal}
        onLeaveGroup={handleLeaveGroup}
        groupName="75% HTN"
      />
    </View>
  );
};

export default function TabThreeScreen({ hasGroup = true }: TabThreeScreenProps) {
  return hasGroup ? <HasGroupView /> : <NoGroupView />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },

  // No Group Styles
  noGroupContainer: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  noGroupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(187, 187, 187, 0.2)',
    borderStyle: 'solid',
  },
  noGroupMessage: {
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '500',
    color: '#A76CF0',
    textAlign: 'center',
    marginBottom: 30,
  },
  noGroupButtons: {
    gap: 15,
  },
  noGroupButton: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
  },
  createButton: {
    backgroundColor: '#D2F7C5',
  },
  createButtonIcon: {
    backgroundColor: 'rgba(117, 203, 71, 0.2)',
  },
  createButtonText: {
    color: '#75CB47',
  },
  joinButton: {
    backgroundColor: '#D6E1FF',
  },
  joinButtonIcon: {
    backgroundColor: 'rgba(71, 133, 234, 0.2)',
  },
  joinButtonText: {
    color: '#4785EA',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    width: '100%',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(117, 203, 71, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#75CB47',
  },

  // Has Group Styles
  groupOverview: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingVertical: 14,
  },
  groupInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupName: {
    fontSize: 21,
    fontWeight: '700',
    color: '#A76CF0',
  },
  editButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 34,
    height: 34,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#75CB47',
  },
  leaveButton: {
    backgroundColor: '#F06C6C',
  },
  memberList: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 6,
    borderRadius: 12,
    paddingVertical: 0,
    gap: 0,
    borderWidth: 2,
    borderColor: 'rgba(187, 187, 187, 0.2)',
    borderStyle: 'solid',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(187, 187, 187, 0.2)',
  },
  lastMemberItem: {
    borderBottomWidth: 0,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  boopCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  boopText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 2,
    color: '#bbbbbb',
  },
  leaderBoopText: {
    color: '#E88D4C',
  },
  doNotDisturbContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  doNotDisturbText: {
    fontSize: 16,
    color: '#333333',
  },
  boopLogContainer: {
    paddingHorizontal: 25,
    paddingRight: 35,
    paddingVertical: 16,
    marginTop: 16,
  },
  boopLogTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#A76CF0',
    marginBottom: 12,
  },
});