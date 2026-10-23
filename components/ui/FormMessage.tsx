import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/constants/theme';

type Tone = 'error' | 'success' | 'info';

const toneStyles: Record<Tone, { bg: string; fg: string }> = {
  error: { bg: colors.dangerSurface, fg: colors.danger },
  success: { bg: colors.successSurface, fg: colors.success },
  info: { bg: colors.infoSurface, fg: colors.info },
};

export function FormMessage({ tone, message }: { tone: Tone; message: string | null }) {
  if (!message) return null;
  const { bg, fg } = toneStyles[tone];
  return (
    <View
      style={[styles.box, { backgroundColor: bg, borderColor: fg }]}
      accessibilityRole={tone === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
    >
      <Text style={[styles.text, { color: fg }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: radius.md, padding: spacing.md },
  text: typography.body,
});
