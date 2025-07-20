import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface BoopLogItemProps {
  user1: {
    name: string;
    profilePhoto: string;
  };
  user2: {
    name: string;
    profilePhoto: string;
  };
  date: string;
  time: string;
  location: string;
}

export function BoopLogItem({ user1, user2, date, time, location }: BoopLogItemProps) {
  return (
    <View style={styles.boopLogItem}>
      <View style={styles.boopLogAvatars}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user1.profilePhoto }} 
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
        </View>
        <View style={styles.avatarWrapperRight}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user2.profilePhoto }} 
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
      <View style={styles.boopLogContent}>
        <View style={styles.boopLogHeader}>
          <ThemedText style={styles.boopLogDate}>{date}</ThemedText>
          <ThemedText style={styles.boopLogTime}>{time}</ThemedText>
        </View>
        <ThemedText style={styles.boopLogDescription}>
          {user1.name} and {user2.name} booped at{' '}
          <ThemedText style={styles.boopLogLocation}>{location}</ThemedText>
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boopLogItem: {
    flexDirection: 'row',
    marginBottom: 12, // Reduced from 16
    paddingVertical: 6, // Reduced from 8
  },
  boopLogAvatars: {
    flexDirection: 'row',
    marginRight: 12,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 36, // Reduced from 40
    height: 36, // Reduced from 40
    borderRadius: 18, // Reduced from 20
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapperRight: {
    width: 36, // Reduced from 40
    height: 36, // Reduced from 40
    borderRadius: 18, // Reduced from 20
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -18, // Reduced from -20 to maintain overlap
  },
  avatarContainer: {
    width: 32, // Reduced from 40
    height: 32, // Reduced from 40
    borderRadius: 16, // Reduced from 20
    overflow: 'hidden',
  },
  profileImage: {
    width: 32, // Reduced from 40
    height: 32, // Reduced from 40
    borderRadius: 16, // Reduced from 20
  },
  boopLogContent: {
    flex: 1,
  },
  boopLogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3, // Reduced from 4
  },
  boopLogDate: {
    fontSize: 14,
    color: '#666666',
  },
  boopLogTime: {
    fontSize: 14,
    color: '#666666',
  },
  boopLogDescription: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 18, // Reduced from 20
  },
  boopLogLocation: {
    fontSize: 12,
    color: '#2196F3',
  },
}); 