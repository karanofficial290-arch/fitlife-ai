import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useId, type ReactNode } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  type DimensionValue,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';

import type { IconName } from './IconBadge';

type Props = {
  source: ImageSourcePropType | null | undefined;
  /** Icon shown on the placeholder until a real photo is supplied. */
  placeholderIcon: IconName;
  style?: StyleProp<ViewStyle>;
  /**
   * cover: photo fills the whole box (cards, tiles).
   * right: photo fills only the right part and fades into `background`, so text
   * on the left stays readable — the hero layout from the designs.
   */
  layout?: 'cover' | 'right';
  /** Width of the photo area in `right` layout. */
  rightWidth?: DimensionValue;
  /** Card colour behind the text in `right` layout. */
  background?: string;
  children?: ReactNode;
};

function Fade({ color, id }: { color: string; id: string }) {
  return (
    <Svg width="100%" height="100%" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={color} stopOpacity={1} />
          <Stop offset="0.35" stopColor={color} stopOpacity={0.55} />
          <Stop offset="0.7" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

/** A photo area with a branded fallback. Decorative: hidden from screen readers. */
export function PhotoSlot({ source, placeholderIcon, style, layout = 'cover', rightWidth = '58%', background = colors.surface, children }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  if (source && layout === 'right') {
    return (
      <View style={[styles.base, { backgroundColor: background }, style]}>
        <View style={[styles.rightArea, { width: rightWidth }]} pointerEvents="none" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
          <Image source={source} style={StyleSheet.absoluteFill} resizeMode="cover" accessibilityIgnoresInvertColors />
          <View style={StyleSheet.absoluteFill}>
            <Fade color={background} id={`f${uid}`} />
          </View>
        </View>
        {children}
      </View>
    );
  }

  if (source) {
    return (
      <ImageBackground source={source} resizeMode="cover" style={[styles.base, style]} accessibilityIgnoresInvertColors>
        {children}
      </ImageBackground>
    );
  }

  const right = layout === 'right';
  return (
    <View style={[styles.base, style]}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id={`p${uid}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#F2FBF7" />
              <Stop offset="1" stopColor="#CDEFE2" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#p${uid})`} />
        </Svg>
      </View>
      <View
        style={[StyleSheet.absoluteFill, styles.iconWrap, right && styles.iconRight]}
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        <MaterialCommunityIcons name={placeholderIcon} size={right ? 110 : 56} color={colors.accent} style={{ opacity: right ? 0.35 : 0.55 }} />
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden', backgroundColor: colors.accentSoft },
  rightArea: { position: 'absolute', right: 0, top: 0, bottom: 0 },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
  iconRight: { alignItems: 'flex-end', paddingRight: 16 },
});
