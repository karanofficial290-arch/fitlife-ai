import { View, type DimensionValue } from 'react-native';

import { colors, radius } from '@/constants/theme';

/** Static placeholder block shown while data loads. */
export function Skeleton({ width = '100%', height = 16 }: { width?: DimensionValue; height?: number }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ width, height, borderRadius: radius.sm, backgroundColor: colors.surfaceRaised }}
    />
  );
}
