import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography } from '@/constants/theme';

import { MUSCLE_GROUPS, MUSCLE_ICONS, MUSCLE_LABELS, type MuscleGroup } from '../types';

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
            <MaterialCommunityIcons
              name={MUSCLE_ICONS[group]}
              size={34}
              color={selected ? colors.accent : colors.textMuted}
            />
            <Text style={[styles.label, selected && styles.labelSelected]}>{MUSCLE_LABELS[group]}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, paddingVertical: 2 },
  tile: {
    width: 92,
    height: 96,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  tileSelected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  label: { ...typography.label, color: colors.text },
  labelSelected: { color: colors.accentText },
});
