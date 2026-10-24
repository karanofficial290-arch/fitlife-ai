import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { colors, radius, spacing, typography } from '@/constants/theme';

export type LegalSection = { heading: string; body: string[] };

type Props = { title: string; updated: string; intro: string; sections: LegalSection[] };

/** Simple readable legal document screen. */
export function LegalPage({ title, updated, intro, sections }: Props) {
  return (
    <Screen>
      <ScreenHeader title={title} />
      <View style={styles.draft}>
        <Text style={styles.draftText}>DRAFT — FITMXO owner ki review ke baad final hoga. Last updated: {updated}</Text>
      </View>
      <Text style={styles.body}>{intro}</Text>
      {sections.map((s) => (
        <View key={s.heading} style={styles.section}>
          <Text style={styles.heading} accessibilityRole="header">
            {s.heading}
          </Text>
          {s.body.map((p, i) => (
            <Text key={i} style={styles.body}>
              {p}
            </Text>
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  draft: { backgroundColor: colors.caloriesSoft, borderRadius: radius.md, padding: spacing.md },
  draftText: { ...typography.caption, color: colors.calories, fontWeight: '700' },
  section: { gap: spacing.sm },
  heading: { ...typography.subheading, color: colors.text },
  body: { ...typography.body, color: colors.text },
});
