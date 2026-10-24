import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, MIN_TOUCH_TARGET, radius, spacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
  /** Icon before the label, e.g. "play" for Start Workout. */
  icon?: IconName;
  /** Show a trailing chevron like the reference designs. */
  chevron?: boolean;
  /** Trailing icon instead of the chevron, e.g. "arrow-right". */
  trailingIcon?: IconName;
  size?: 'regular' | 'compact';
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  accessibilityHint,
  icon,
  chevron = false,
  trailingIcon,
  size = 'regular',
}: Props) {
  const trailing = trailingIcon ?? (chevron ? 'chevron-right' : undefined);
  const isDisabled = disabled || loading;
  const textColor = variant === 'primary' ? colors.onAccent : variant === 'danger' ? colors.danger : colors.text;
  const compact = size === 'compact';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        styles[variant],
        pressed && variant === 'primary' && { backgroundColor: colors.accentPressed },
        pressed && variant !== 'primary' && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.row}>
          {icon ? <MaterialCommunityIcons name={icon} size={compact ? 20 : 24} color={textColor} /> : null}
          <Text style={[styles.text, compact && styles.textCompact, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
          {trailing ? <MaterialCommunityIcons name={trailing} size={compact ? 20 : 24} color={textColor} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH_TARGET + 4,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compact: { minHeight: MIN_TOUCH_TARGET, paddingHorizontal: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.danger },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },
  // 19px bold counts as large text, so white on brand green (3.77:1) meets AA.
  text: { fontSize: 19, fontWeight: '800', lineHeight: 24 },
  // Compact buttons stay ≥18.66px bold for the same reason.
  textCompact: { fontSize: 19, lineHeight: 24 },
});
