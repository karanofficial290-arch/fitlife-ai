import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '@/constants/theme';

type Segment = { value: number; color: string };

type Props = {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  children?: ReactNode;
  accessibilityLabel?: string;
};

/** Donut split into coloured segments by share of the total (e.g. macro split). */
export function SegmentRing({ segments, size = 120, strokeWidth = 12, children, accessibilityLabel }: Props) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  const gap = total > 0 && segments.filter((s) => s.value > 0).length > 1 ? 4 : 0;

  let offset = 0;
  return (
    <View style={{ width: size, height: size }} accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.surfaceRaised} strokeWidth={strokeWidth} fill="none" />
        {total > 0
          ? segments.map((s, i) => {
              if (s.value <= 0) return null;
              const len = Math.max(0, (s.value / total) * c - gap);
              const el = (
                <Circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  stroke={s.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${len} ${c - len}`}
                  strokeDashoffset={-offset}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              );
              offset += (s.value / total) * c;
              return el;
            })
          : null}
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
});
