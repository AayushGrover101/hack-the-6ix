import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ThemedText } from './ThemedText';
import Svg, { Path } from 'react-native-svg';

interface JoinGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onJoinGroup: (inviteCode: string) => void;
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ 
  visible, 
  onClose, 
  onJoinGroup 
}) => {
  const [inviteCode, setInviteCode] = useState('');

  const handleJoinGroup = () => {
    if (inviteCode.trim()) {
      onJoinGroup(inviteCode.trim());
      setInviteCode('');
      onClose();
    }
  };

  const handleClose = () => {
    setInviteCode('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Title */}
          <ThemedText style={styles.title}>Join existing boop group</ThemedText>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>INVITE CODE</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={inviteCode}
                onChangeText={setInviteCode}
                placeholder="e.g. 6YFU78R"
                placeholderTextColor="#BBBBBB"
                autoFocus={true}
                autoCapitalize="characters"
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.joinButton]} 
              onPress={handleJoinGroup}
              activeOpacity={0.7}
            >
              <View style={styles.joinButtonContent}>
                <ThemedText style={styles.joinButtonText}>Join</ThemedText>
              </View>
            </TouchableOpacity>
          </View>
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
    maxWidth: 320,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4785EA',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#BBBBBB',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#333333',
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  joinButton: {
    backgroundColor: '#D6E1FF',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4785EA',
  },
  joinButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
}); 