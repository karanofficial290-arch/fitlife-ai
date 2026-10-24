import { MaterialCommunityIcons } from '@expo/vector-icons';
import { forwardRef, useState, type ComponentProps, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, MIN_TOUCH_TARGET, radius, spacing, typography } from '@/constants/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type Props = Omit<TextInputProps, 'style'> & {
  icon: IconName;
  /** Small label shown inside the box above the input (sign-up style). */
  label?: string;
  /** Spoken name when there is no visible label (login style). */
  accessibleName?: string;
  error?: string | null;
  /** Adds a show/hide toggle and starts hidden. */
  password?: boolean;
  /** Extra element on the right (e.g. a chevron for pickers). */
  right?: ReactNode;
};

/** Rounded input with a leading icon, matching the FITMXO auth designs. */
export const IconField = forwardRef<TextInput, Props>(function IconField(
  { icon, label, accessibleName, error, password, right, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const name = label ?? accessibleName ?? rest.placeholder ?? '';

  return (
    <View style={styles.wrap}>
      <View style={[styles.box, focused && styles.boxFocused, !!error && styles.boxError]}>
        <MaterialCommunityIcons name={icon} size={26} color={colors.text} />
        <View style={styles.flex}>
          {label ? <Text style={styles.label}>{label}</Text> : null}
          <TextInput
            ref={ref}
            accessibilityLabel={name}
            accessibilityHint={error ?? undefined}
            placeholderTextColor="#8A97A8"
            selectionColor={colors.accent}
            secureTextEntry={password ? hidden : rest.secureTextEntry}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            style={[styles.input, label ? styles.inputWithLabel : null]}
            {...rest}
          />
        </View>
        {password ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Password dikhayein' : 'Password chhupayein'}
            hitSlop={8}
            style={styles.eye}
          >
            <MaterialCommunityIcons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={24} color={colors.textMuted} />
          </Pressable>
        ) : null}
        {right}
      </View>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  flex: { flex: 1 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 64,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#FBFCFD',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  boxFocused: { borderColor: colors.accent, backgroundColor: colors.surface },
  boxError: { borderColor: colors.danger },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginTop: 8 },
  input: { ...typography.body, color: colors.text, minHeight: MIN_TOUCH_TARGET, paddingVertical: 0 },
  inputWithLabel: { minHeight: 32, marginBottom: 6 },
  eye: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  error: { ...typography.caption, color: colors.danger, marginLeft: spacing.sm },
});
