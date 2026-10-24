import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '@/constants/theme';

/** FITMXO mark: a figure with arms raised as two leaves (vector, crisp at any size). */
export function LogoMark({ size = 48, color = colors.accent }: { size?: number; color?: string }) {
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* head */}
      <Circle cx={32} cy={11} r={7} fill={color} />
      {/* left leaf / arm */}
      <Path d="M30 58 C 14 52, 4 36, 6 18 C 18 22, 28 34, 30 58 Z" fill={color} />
      {/* right leaf / arm */}
      <Path d="M34 58 C 50 52, 60 36, 58 18 C 46 22, 36 34, 34 58 Z" fill={color} opacity={0.85} />
      {/* leaf veins */}
      <Path d="M29 54 C 24 42, 17 32, 10 23" stroke="#FFFFFF" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Path d="M35 54 C 40 42, 47 32, 54 23" stroke="#FFFFFF" strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </Svg>
    </View>
  );
}
