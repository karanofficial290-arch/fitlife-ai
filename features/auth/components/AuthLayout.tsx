import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LogoMark } from '@/components/brand/LogoMark';
import { cardShadow, colors, MIN_TOUCH_TARGET, spacing } from '@/constants/theme';

type Props = {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  photo: ImageSourcePropType;
  /** Width / height of the photo file. */
  photoAspect: number;
  showBack?: boolean;
  children: ReactNode;
};

/** Shared layout of the Login and Sign Up designs: brand, big title, photo, white form card. */
export function AuthLayout({ titleLine1, titleLine2, subtitle, photo, photoAspect, showBack, children }: Props) {
  const { width } = useWindowDimensions();
  const photoWidth = Math.min(width * 0.6, 420);
  const photoHeight = photoWidth / photoAspect;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[styles.top, { minHeight: photoHeight + 24 }]}>
            <Image
              source={photo}
              style={[styles.photo, { width: photoWidth, height: photoHeight }]}
              resizeMode="contain"
              accessibilityIgnoresInvertColors
              importantForAccessibility="no"
              accessibilityElementsHidden
            />
            {showBack ? (
              <Pressable
                onPress={() => (router.canGoBack() ? router.back() : router.replace('/sign-in'))}
                accessibilityRole="button"
                accessibilityLabel="Wapas jaayein"
                style={styles.back}
              >
                <MaterialCommunityIcons name="chevron-left" size={32} color={colors.text} />
              </Pressable>
            ) : null}
            <View style={styles.brand} accessible accessibilityRole="header" accessibilityLabel="FITMXO. Build your best self">
              <LogoMark size={56} />
              <View>
                <Text style={styles.brandName}>
                  FIT<Text style={styles.brandAccent}>MXO</Text>
                </Text>
                <Text style={styles.tagline}>BUILD YOUR BEST SELF</Text>
              </View>
            </View>
            <View style={styles.titleBlock}>
              <Text style={styles.title1} accessibilityRole="header">
                {titleLine1}
              </Text>
              <Text style={styles.title2}>{titleLine2}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>

          <View style={styles.card}>{children}</View>

          <View style={styles.footer} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
            <View style={styles.footerLine} />
            <Text style={styles.footerText}>FITNESS</Text>
            <MaterialCommunityIcons name="heart" size={12} color={colors.accent} />
            <Text style={styles.footerText}>NUTRITION</Text>
            <MaterialCommunityIcons name="heart" size={12} color={colors.accent} />
            <Text style={styles.footerText}>WELLNESS</Text>
            <View style={styles.footerLine} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F9F8' },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  top: { position: 'relative', paddingTop: spacing.md },
  photo: { position: 'absolute', right: -spacing.lg, bottom: 0 },
  back: { width: MIN_TOUCH_TARGET, height: MIN_TOUCH_TARGET, justifyContent: 'center', marginLeft: -spacing.sm },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandName: { fontSize: 32, fontWeight: '900', color: '#052042', lineHeight: 36, letterSpacing: 0.5 },
  brandAccent: { color: colors.accent },
  tagline: { fontSize: 10, fontWeight: '800', color: '#2C3A5D', letterSpacing: 2.6 },
  titleBlock: { marginTop: spacing.xl, maxWidth: '58%', paddingBottom: spacing.lg },
  title1: { fontSize: 32, lineHeight: 38, fontWeight: '900', color: '#052042' },
  title2: { fontSize: 38, lineHeight: 44, fontWeight: '900', color: colors.accent },
  subtitle: { fontSize: 16, lineHeight: 23, color: colors.textMuted, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...cardShadow,
  },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: spacing.xl },
  footerLine: { width: 28, height: 2, backgroundColor: colors.accent },
  footerText: { fontSize: 11, fontWeight: '600', letterSpacing: 2.4, color: colors.textMuted },
});
