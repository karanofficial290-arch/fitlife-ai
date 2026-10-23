import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

/** Brand header from the designs: logo, app name, tagline, optional right slot. */
export function AppHeader({ right }: { right?: ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.brand} accessible accessibilityRole="header" accessibilityLabel="FitMxo. Better Health, Stronger You">
        <View style={styles.logo}>
          <MaterialCommunityIcons name="leaf" size={26} color={colors.onAccent} />
        </View>
        <View>
          <Text style={styles.name}>
            Fit<Text style={styles.nameAccent}>Mxo</Text>
          </Text>
          <Text style={styles.tagline}>Better Health • Stronger You</Text>
        </View>
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flexShrink: 1 },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: { fontSize: 26, fontWeight: '800', color: colors.text, lineHeight: 30 },
  nameAccent: { color: colors.accent },
  tagline: { fontSize: 13, color: colors.textMuted },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
