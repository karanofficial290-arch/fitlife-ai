import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';

import { Button } from './Button';
import { FormMessage } from './FormMessage';

export function ErrorRetry({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  if (!message) return null;
  return (
    <View style={styles.block}>
      <FormMessage tone="error" message={message} />
      <Button title="Dobara try karein" variant="secondary" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({ block: { gap: spacing.sm } });
