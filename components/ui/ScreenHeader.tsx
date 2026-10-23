import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, MIN_TOUCH_TARGET, spacing, typography } from '@/constants/theme';

type Props = { title: string; onBack?: () => void };

/** Back button + title for stack screens. Falls back to Home if there is no history. */
export function ScreenHeader({ title, onBack }: Props) {
  function handleBack() {
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  return (
    <View style={styles.row}>
      <Pressable
        onPress={handleBack}
        accessibilityRole="button"
        accessibilityLabel="Wapas jaayein"
        style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  back: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    borderRadius: MIN_TOUCH_TARGET / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { ...typography.heading, color: colors.text, flex: 1 },
});
