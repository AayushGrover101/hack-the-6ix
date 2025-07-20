import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { ThemedText } from '@/components/ThemedText';

interface PageHeaderProps {
  title: string;
  imageSource?: any;
  icon?: React.ReactNode;
  color?: string;
}

export function PageHeader({ title, imageSource, icon, color }: PageHeaderProps) {
  return (
    <View style={styles.imageContainer}>
      <Image
        source={imageSource || require('@/assets/images/boop-group/boop-group-header.png')}
        style={styles.headerImage}
        contentFit="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.titleContainer}>
          {icon || (
            <Svg width={30} height={30} viewBox="0 0 25 24" fill="none">
              <Path 
                d="M17.0885 21V19C17.0885 17.9391 16.667 16.9217 15.9169 16.1716C15.1667 15.4214 14.1493 15 13.0885 15H5.08846C4.02759 15 3.01017 15.4214 2.26003 16.1716C1.50988 16.9217 1.08846 17.9391 1.08846 19V21M23.0885 21V19C23.0878 18.1137 22.7928 17.2528 22.2498 16.5523C21.7068 15.8519 20.9466 15.3516 20.0885 15.13M16.0885 3.13C16.9489 3.3503 17.7115 3.8507 18.2561 4.55231C18.8007 5.25392 19.0963 6.11683 19.0963 7.005C19.0963 7.89317 18.8007 8.75608 18.2561 9.45769C17.7115 10.1593 16.9489 10.6597 16.0885 10.88M13.0885 7C13.0885 9.20914 11.2976 11 9.08846 11C6.87932 11 5.08846 9.20914 5.08846 7C5.08846 4.79086 6.87932 3 9.08846 3C11.2976 3 13.0885 4.79086 13.0885 7Z" 
                stroke={color} 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </Svg>
          )}
          <ThemedText style={[styles.titleText, { color: color }]}>{title}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 140,
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingHorizontal: 30,
    paddingBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  titleText: {
    fontSize: 34,
    fontWeight: '600',
    color: '#A76CF0',
    lineHeight: 34,
    includeFontPadding: false,
    textAlignVertical: 'bottom',
  },
}); 