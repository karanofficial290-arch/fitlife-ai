import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, MIN_TOUCH_TARGET } from '@/constants/theme';
import { initials } from '@/utils/text';

type Props = { name: string | null | undefined; onPress?: () => void; size?: number };

/** Initials avatar (no photo upload yet). Tappable when onPress is given. */
export function Avatar({ name, onPress, size = MIN_TOUCH_TARGET }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'image'}
      accessibilityLabel={onPress ? 'Profile kholein' : `Avatar ${name ?? ''}`}
      style={({ pressed }) => [
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.38 }]}>{initials(name)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.accentSoft,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontWeight: '700', color: colors.accentText },
});
