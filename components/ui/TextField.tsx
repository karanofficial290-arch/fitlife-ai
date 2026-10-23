import { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, MIN_TOUCH_TARGET, radius, spacing, typography } from '@/constants/theme';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
  error?: string | null;
};

export const TextField = forwardRef<TextInput, Props>(function TextField({ label, error, onFocus, onBlur, ...rest }, ref) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        accessibilityHint={error ?? undefined}
        placeholderTextColor={colors.textMuted}
        selectionColor={colors.accent}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[styles.input, focused && styles.inputFocused, !!error && styles.inputError]}
        {...rest}
      />
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  label: { ...typography.label, color: colors.text },
  input: {
    ...typography.body,
    minHeight: MIN_TOUCH_TARGET,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  inputFocused: { borderColor: colors.accent },
  inputError: { borderColor: colors.danger },
  error: { ...typography.caption, color: colors.danger },
});
