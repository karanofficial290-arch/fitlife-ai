import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';

type Tone = 'green' | 'blue' | 'purple' | 'orange' | 'grey';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  green: { bg: colors.accentSoft, fg: colors.accentText },
  blue: { bg: colors.waterSoft, fg: colors.water },
  purple: { bg: colors.purpleSoft, fg: colors.purple },
  orange: { bg: colors.caloriesSoft, fg: colors.calories },
  grey: { bg: colors.surfaceRaised, fg: colors.textMuted },
};

export function Pill({ label, tone = 'green' }: { label: string; tone?: Tone }) {
  const t = TONES[tone];
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <Text style={[styles.text, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

export function levelTone(level: string): Tone {
  if (level === 'beginner') return 'green';
  if (level === 'intermediate') return 'blue';
  if (level === 'advanced') return 'purple';
  return 'grey';
}

const styles = StyleSheet.create({
  pill: { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4 },
  text: { fontSize: 12, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase' },
});
