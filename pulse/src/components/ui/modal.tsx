import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import type { ReactNode } from 'react';
import { COLORS } from '@/constants/colors';
import { RADIUS, SPACING } from '@/theme/spacing';
import { TYPOGRAPHY } from '@/theme/typography';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

/** Themed modal overlay with title and close action */
export function Modal({ visible, onClose, title, children }: ModalProps) {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');
  const themeColors = COLORS[scheme];

  return (
    <RNModal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.content,
            { backgroundColor: scheme === 'dark' ? themeColors.surface : '#FFFFFF' },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {title ? (
            <Text style={[styles.title, { color: themeColors.textPrimary }]}>
              {title}
            </Text>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  content: {
    width: '100%',
    borderRadius: RADIUS.card,
    padding: SPACING.xl,
    maxHeight: '80%',
  },
  title: {
    fontSize: TYPOGRAPHY.heading.fontSize,
    fontWeight: '600',
    marginBottom: SPACING.base,
  },
});
