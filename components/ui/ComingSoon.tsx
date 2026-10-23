import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/constants/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

/**
 * Honest empty state for modules that are planned but not yet built.
 * It has no buttons, so there is nothing that looks interactive but does nothing.
 */
export function ComingSoon({ icon, title, description }: { icon: IconName; title: string; description: string }) {
  return (
    <View style={styles.container} accessible accessibilityLabel={`${title}. ${description}`}>
      <Ionicons name={icon} size={48} color={colors.accent} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  title: { ...typography.heading, color: colors.text, textAlign: 'center' },
  description: { ...typography.body, color: colors.textMuted, textAlign: 'center', maxWidth: 320 },
});
