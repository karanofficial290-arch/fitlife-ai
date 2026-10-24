import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { ImageBackground, StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';

import type { IconName } from './IconBadge';

type Props = {
  source: ImageSourcePropType | null | undefined;
  /** Icon shown on the placeholder until a real photo is supplied. */
  placeholderIcon: IconName;
  style?: StyleProp<ViewStyle>;
  /** Fade from the left so overlaid text stays readable on photos. */
  fadeLeft?: boolean;
  /** Where the placeholder icon sits. */
  iconAlign?: 'center' | 'right';
  children?: ReactNode;
};

/** A photo area with a branded fallback. Decorative: hidden from screen readers. */
export function PhotoSlot({ source, placeholderIcon, style, fadeLeft, iconAlign = 'center', children }: Props) {
  const fade = fadeLeft ? (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0.96} />
            <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity={0.75} />
            <Stop offset="0.75" stopColor="#FFFFFF" stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#fade)" />
      </Svg>
    </View>
  ) : null;

  if (source) {
    return (
      <ImageBackground source={source} resizeMode="cover" style={[styles.base, style]} imageStyle={styles.image} accessibilityIgnoresInvertColors>
        {fade}
        {children}
      </ImageBackground>
    );
  }

  return (
    <View style={[styles.base, style]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="ph" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#F2FBF7" />
              <Stop offset="1" stopColor="#CDEFE2" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#ph)" />
        </Svg>
      </View>
      <View
        style={[StyleSheet.absoluteFill, styles.iconWrap, iconAlign === 'right' && styles.iconRight]}
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        <MaterialCommunityIcons name={placeholderIcon} size={iconAlign === 'right' ? 110 : 56} color={colors.accent} style={{ opacity: iconAlign === 'right' ? 0.35 : 0.55 }} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden', backgroundColor: colors.accentSoft },
  image: {},
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  iconRight: { alignItems: 'flex-end', paddingRight: 16 },
});
