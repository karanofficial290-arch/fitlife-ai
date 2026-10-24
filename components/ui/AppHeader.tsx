import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LogoMark } from '@/components/brand/LogoMark';
import { colors, spacing } from '@/constants/theme';

/** Brand header from the references: logo, FITMXO wordmark, tagline, optional right slot. */
export function AppHeader({ right }: { right?: ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.brand} accessible accessibilityRole="header" accessibilityLabel="FITMXO. Build your best self">
        <LogoMark size={46} />
        <View>
          <Text style={styles.name}>
            FIT<Text style={styles.nameAccent}>MXO</Text>
          </Text>
          <Text style={styles.tagline}>BUILD YOUR BEST SELF</Text>
        </View>
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1 },
  name: { fontSize: 30, fontWeight: '900', color: '#052042', lineHeight: 34, letterSpacing: 0.5 },
  nameAccent: { color: colors.accent },
  tagline: { fontSize: 10, fontWeight: '800', color: '#2C3A5D', letterSpacing: 2.4 },
  right: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
