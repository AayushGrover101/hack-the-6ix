import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import Svg, { Path } from 'react-native-svg';

interface LeaveGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onLeaveGroup: () => void;
  groupName: string;
}

export const LeaveGroupModal: React.FC<LeaveGroupModalProps> = ({ 
  visible, 
  onClose, 
  onLeaveGroup, 
  groupName 
}) => {
  const handleLeaveGroup = () => {
    onLeaveGroup();
    onClose();
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
          {/* Title */}
          <ThemedText style={styles.title}>Leave group?</ThemedText>

          {/* Description */}
          <ThemedText style={styles.description}>
            Are you sure you want to leave &quot;{groupName}&quot;? <ThemedText style={styles.boldText}>You can&apos;t undo this action.</ThemedText>
          </ThemedText>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.leaveButton]} 
              onPress={handleLeaveGroup}
              activeOpacity={0.7}
            >
              <Svg width={25} height={25} viewBox="0 0 20 25" fill="none" style={styles.leaveButtonIcon}>
                <Path 
                  d="M15 7C16.1046 7 17 6.10457 17 5C17 3.89543 16.1046 3 15 3C13.8954 3 13 3.89543 13 5C13 6.10457 13.8954 7 15 7Z" 
                  stroke="#F06C6C" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <Path 
                  d="M12.6132 8.26697L9.30499 12.4022L13.4402 16.5374L11.3726 21.0862" 
                  stroke="#F06C6C" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <Path 
                  d="M6.4104 9.50753L9.79728 6.19934L12.6132 8.26695L15.508 11.5752H19.2297" 
                  stroke="#F06C6C" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <Path 
                  d="M8.89152 15.7103L7.65095 16.5374H4.34277" 
                  stroke="#F06C6C" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </Svg>
              <ThemedText style={styles.leaveButtonText}>Leave</ThemedText>
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
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#F06C6C',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
    fontWeight: '300',
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 100,
  },
  leaveButton: {
    backgroundColor: '#FFD6D6',
    borderRadius: 100,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666666',
  },
  leaveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F06C6C',
  },
  leaveButtonIcon: {
    marginRight: 8,
  },
  boldText: {
    fontWeight: '500',
  },
}); 