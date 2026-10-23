import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { View } from 'react-native';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

type Props = { name: IconName; color: string; background: string; size?: number };

/** Round icon chip used across cards and quick actions. Decorative only. */
export function IconBadge({ name, color, background, size = 44 }: Props) {
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <MaterialCommunityIcons name={name} size={Math.round(size * 0.52)} color={color} />
    </View>
  );
}
