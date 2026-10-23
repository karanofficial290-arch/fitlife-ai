import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { cardShadow, colors, radius, spacing, typography } from '@/constants/theme';

type Props = { title?: string; children: ReactNode; style?: StyleProp<ViewStyle> };

export function Card({ title, children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      {title ? (
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    ...cardShadow,
  },
  title: { ...typography.subheading, color: colors.text },
});
