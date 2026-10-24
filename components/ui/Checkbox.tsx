import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, MIN_TOUCH_TARGET, spacing } from '@/constants/theme';

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Spoken label; visible content goes in children. */
  accessibilityLabel: string;
  children: ReactNode;
  error?: boolean;
};

export function Checkbox({ checked, onChange, accessibilityLabel, children, error }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onChange(!checked)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={accessibilityLabel}
        hitSlop={10}
        style={styles.hit}
      >
        <View style={[styles.box, checked && styles.boxChecked, error && !checked && styles.boxError]}>
          {checked ? <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" /> : null}
        </View>
      </Pressable>
      <View style={styles.label}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexShrink: 1 },
  hit: { minWidth: MIN_TOUCH_TARGET - 8, minHeight: MIN_TOUCH_TARGET - 8, justifyContent: 'center' },
  box: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: { backgroundColor: colors.accent, borderColor: colors.accent },
  boxError: { borderColor: colors.danger },
  label: { flexShrink: 1 },
});
