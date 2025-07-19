import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import { AUTH_CONFIG } from '../config/auth';
import * as AuthSession from 'expo-auth-session';

export default function AuthDebug() {
  const { isLoading, isAuthenticated, user, accessToken } = useAuth();

  const redirectUri = AuthSession.makeRedirectUri({
    scheme: AUTH_CONFIG.APP_SCHEME,
    path: 'auth',
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>🔐 Auth Debug Info</ThemedText>
      
      <View style={styles.section}>
        <ThemedText style={styles.label}>Loading:</ThemedText>
        <ThemedText style={styles.value}>{isLoading ? 'Yes ⏳' : 'No ✅'}</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Authenticated:</ThemedText>
        <ThemedText style={styles.value}>{isAuthenticated ? 'Yes ✅' : 'No ❌'}</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Has Access Token:</ThemedText>
        <ThemedText style={styles.value}>{accessToken ? 'Yes ✅' : 'No ❌'}</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Redirect URI:</ThemedText>
        <ThemedText style={styles.value} numberOfLines={2}>{redirectUri}</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Auth0 Domain:</ThemedText>
        <ThemedText style={styles.value}>{AUTH_CONFIG.AUTH0_DOMAIN}</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>User Name:</ThemedText>
        <ThemedText style={styles.value}>{user?.name || 'N/A'}</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>User Email:</ThemedText>
        <ThemedText style={styles.value}>{user?.email || 'N/A'}</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>User ID:</ThemedText>
        <ThemedText style={styles.value} numberOfLines={3}>
          {user?.uid || 'N/A'}
        </ThemedText>
      </View>

      {user?.profilePicture && (
        <View style={styles.section}>
          <ThemedText style={styles.label}>Profile Picture URL:</ThemedText>
          <ThemedText style={styles.value} numberOfLines={2}>
            {user.profilePicture}
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'ItcKabelDemi',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: 'GeneralSanSemiBold',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontFamily: 'GeneralSanMedium',
    opacity: 0.8,
  },
});

