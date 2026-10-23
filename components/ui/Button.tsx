import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, MIN_TOUCH_TARGET, radius, spacing, typography } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
};

export function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, accessibilityHint }: Props) {
  const isDisabled = disabled || loading;
  const textColor = variant === 'primary' ? colors.onAccent : variant === 'danger' ? colors.danger : colors.text;

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
        styles[variant],
        pressed && variant === 'primary' && { backgroundColor: colors.accentPressed },
        pressed && variant !== 'primary' && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: MIN_TOUCH_TARGET,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.accent },
  secondary: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.danger },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.5 },
  text: { ...typography.label, fontSize: 16 },
});
