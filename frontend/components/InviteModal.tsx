import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { ThemedText } from './ThemedText';
import Svg, { Path } from 'react-native-svg';
import * as Clipboard from 'expo-clipboard';

interface InviteModalProps {
  visible: boolean;
  onClose: () => void;
  inviteCode: string;
}

export const InviteModal: React.FC<InviteModalProps> = ({ visible, onClose, inviteCode }) => {
  const [showCopiedNotification, setShowCopiedNotification] = React.useState(false);

  const handleCopyCode = async () => {
    try {
      await Clipboard.setStringAsync(inviteCode);
      setShowCopiedNotification(true);
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowCopiedNotification(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      Alert.alert('Error', 'Failed to copy invite code');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Invite your friends!</ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path 
                  d="M18 6L6 18M6 6L18 18" 
                  stroke="#BBBBBB" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Body Content */}
          <View style={styles.body}>
            <ThemedText style={styles.instructionText}>
              Invite them to &quot;75% HTN&quot; so you can starting booping them!
            </ThemedText>
            
            <ThemedText style={styles.copyLabel}>Copy code</ThemedText>
            
            <View style={styles.codeContainer}>
              <TextInput
                style={styles.codeInput}
                value={inviteCode}
                editable={false}
                selectTextOnFocus={true}
              />
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyCode}>
                <Svg width={20} height={20} viewBox="0 0 23 23" fill="none">
                  <Path 
                    d="M4.79163 14.375H3.83329C3.32496 14.375 2.83745 14.173 2.478 13.8136C2.11856 13.4541 1.91663 12.9666 1.91663 12.4583V3.83329C1.91663 3.32496 2.11856 2.83745 2.478 2.478C2.83745 2.11856 3.32496 1.91663 3.83329 1.91663H12.4583C12.9666 1.91663 13.4541 2.11856 13.8136 2.478C14.173 2.83745 14.375 3.32496 14.375 3.83329V4.79163M10.5416 8.62496H19.1666C20.2252 8.62496 21.0833 9.48308 21.0833 10.5416V19.1666C21.0833 20.2252 20.2252 21.0833 19.1666 21.0833H10.5416C9.48308 21.0833 8.62496 20.2252 8.62496 19.1666V10.5416C8.62496 9.48308 9.48308 8.62496 10.5416 8.62496Z" 
                    stroke="#BBBBBB" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>

          {/* Copied Notification */}
          {showCopiedNotification && (
            <View style={styles.copiedNotification}>
              <View style={styles.notificationContent}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path 
                    d="M20 6L9 17L4 12" 
                    stroke="#4CAF50" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </Svg>
                <ThemedText style={styles.notificationText}>Copied to clipboard!</ThemedText>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6FCF97',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    gap: 12,
  },
  instructionText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
    fontWeight: '300',
  },
  copyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginTop: 4,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  codeInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#4785EA',
    paddingVertical: 8,
  },
  copyButton: {
    padding: 4,
  },
  copiedNotification: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
}); 