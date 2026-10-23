import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { colors, typography } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Ye page nahi mila</Text>
      <Text style={styles.body}>Jo link aapne khola wo ab maujood nahi hai.</Text>
      <Button title="Home par jaayein" onPress={() => router.replace('/')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.text },
  body: { ...typography.body, color: colors.textMuted },
});
