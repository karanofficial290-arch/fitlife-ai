import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Polygon, Stop } from 'react-native-svg';

/**
 * FITMXO "X" mark, redrawn from the owner's design as vectors:
 * bright green on the left half, deep teal on the right, crossing in the middle.
 */
export function LogoMark({ size = 48 }: { size?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const a = `xa${id}`;
  const b = `xb${id}`;
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={size} height={size * 0.84} viewBox="0 0 100 84">
        <Defs>
          {/* top-left → bottom-right stroke */}
          <LinearGradient id={a} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#4ACF33" />
            <Stop offset="0.48" stopColor="#26BB38" />
            <Stop offset="0.52" stopColor="#03594E" />
            <Stop offset="1" stopColor="#0A4F46" />
          </LinearGradient>
          {/* top-right → bottom-left stroke */}
          <LinearGradient id={b} x1="1" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0A4F46" />
            <Stop offset="0.45" stopColor="#0B6B4F" />
            <Stop offset="0.55" stopColor="#3CC93A" />
            <Stop offset="1" stopColor="#02AC59" />
          </LinearGradient>
        </Defs>
        <Polygon points="4,4 30,4 96,80 70,80" fill={`url(#${a})`} />
        <Polygon points="70,4 96,4 30,80 4,80" fill={`url(#${b})`} opacity={0.95} />
      </Svg>
    </View>
  );
}
