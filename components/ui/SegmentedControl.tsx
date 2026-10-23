import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, MIN_TOUCH_TARGET, radius, spacing, typography } from '@/constants/theme';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
};

/** Pill-style single-select group (level filter, gym/home toggle). */
export function SegmentedControl<T extends string>({ options, value, onChange, accessibilityLabel }: Props<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <View style={styles.track} accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected, checked: selected }}
              accessibilityLabel={option.label}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  track: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
  },
  option: {
    minHeight: MIN_TOUCH_TARGET - 6,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: { backgroundColor: colors.accent },
  label: { ...typography.label, color: colors.textMuted },
  labelSelected: { color: colors.onAccent },
});
