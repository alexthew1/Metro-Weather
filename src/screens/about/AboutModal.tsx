import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { normalizeFont, horizontalScale } from '../../utils/responsive';
import { MetroButton } from '../../components/metro/MetroButton';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.container, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>about</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.appName}>Metro Weather</Text>
          <Text style={styles.version}>version 1.0.0</Text>

          <Text style={styles.description}>
            A faithful continuation of the classic Windows Phone 8 and 8.1 Bing Weather experience.
          </Text>

          <Text style={styles.subtext}>
            Built with React Native, TypeScript, and pure Metro design principles prioritizing bold typography, flat surfaces, horizontal panorama navigation, and responsive motion.
          </Text>

          <View style={styles.footer}>
            <MetroButton title="done" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pure OLED Black
    paddingHorizontal: horizontalScale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(38),
    fontWeight: '200',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    textTransform: 'lowercase',
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  appName: {
    fontFamily: fontFamilies.semiBold,
    fontSize: normalizeFont(28),
    fontWeight: '600',
    color: colors.textPrimary,
  },
  version: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(14),
    color: colors.textDim,
    marginBottom: 20,
  },
  description: {
    fontFamily: fontFamilies.light,
    fontSize: normalizeFont(18),
    color: colors.textPrimary,
    lineHeight: normalizeFont(26),
    marginBottom: 16,
  },
  subtext: {
    fontFamily: fontFamilies.regular,
    fontSize: normalizeFont(14),
    color: colors.textSecondary,
    lineHeight: normalizeFont(22),
    marginBottom: 32,
  },
  footer: {
    marginTop: 'auto',
  },
});
