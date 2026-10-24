import { Image, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { muscleIcons } from '@/constants/photos';
import { cardShadow, colors, radius, spacing, typography } from '@/constants/theme';

import { MUSCLE_GROUPS, MUSCLE_LABELS, type MuscleGroup } from '../types';

type Props = {
  value: MuscleGroup | 'all';
  /** Tapping the selected group again clears the filter. */
  onChange: (value: MuscleGroup | 'all') => void;
};

export function MuscleGroupPicker({ value, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessibilityRole="radiogroup"
      accessibilityLabel="Muscle group"
    >
      {MUSCLE_GROUPS.map((group) => {
        const selected = value === group;
        return (
          <Pressable
            key={group}
            onPress={() => onChange(selected ? 'all' : group)}
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected }}
            accessibilityLabel={MUSCLE_LABELS[group]}
            accessibilityHint={selected ? 'Filter hatane ke liye dobara tap karein' : undefined}
            style={[styles.tile, selected && styles.tileSelected]}
          >
            <Image
              source={selected ? muscleIcons[group].on : muscleIcons[group].off}
              style={styles.icon}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
            />
            <Text style={[styles.label, selected && styles.labelSelected]}>{MUSCLE_LABELS[group]}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingVertical: 4, paddingRight: spacing.lg },
  tile: {
    width: 96,
    height: 106,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    ...cardShadow,
  },
  tileSelected: { borderColor: colors.accent, backgroundColor: colors.accentSoft, borderWidth: 2 },
  icon: { width: 58, height: 52 },
  label: { ...typography.label, color: colors.text },
  labelSelected: { color: colors.accentText, fontWeight: '800' },
});
