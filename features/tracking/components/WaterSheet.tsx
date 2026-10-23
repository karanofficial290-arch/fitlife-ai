import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { FormMessage } from '@/components/ui/FormMessage';
import { TextField } from '@/components/ui/TextField';
import { colors, MIN_TOUCH_TARGET, radius, spacing, typography } from '@/constants/theme';

import { logWater } from '../trackingService';
import { parseWaterMl } from '../trackingValidation';

const QUICK_AMOUNTS = [250, 500, 750] as const;

type Props = { visible: boolean; userId: string; onClose: () => void; onSaved: () => void };

export function WaterSheet({ visible, userId, onClose, onSaved }: Props) {
  const [custom, setCustom] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingAmount, setSavingAmount] = useState<number | null>(null);

  function close() {
    setCustom('');
    setFieldError(null);
    setError(null);
    onClose();
  }

  async function save(amount: number) {
    setSavingAmount(amount);
    setError(null);
    const result = await logWater(userId, amount);
    setSavingAmount(null);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSaved();
    close();
  }

  function saveCustom() {
    const parsed = parseWaterMl(custom);
    setFieldError(parsed.error);
    if (parsed.value !== null) void save(parsed.value);
  }

  const busy = savingAmount !== null;

  return (
    <BottomSheet visible={visible} title="Paani log karein" onClose={close}>
      <FormMessage tone="error" message={error} />
      <View style={styles.quickRow}>
        {QUICK_AMOUNTS.map((ml) => (
          <Pressable
            key={ml}
            disabled={busy}
            onPress={() => void save(ml)}
            accessibilityRole="button"
            accessibilityLabel={`${ml} ml add karein`}
            accessibilityState={{ disabled: busy, busy: savingAmount === ml }}
            style={({ pressed }) => [styles.quick, pressed && { opacity: 0.7 }, busy && { opacity: 0.5 }]}
          >
            <Text style={styles.quickValue}>+{ml}</Text>
            <Text style={styles.quickUnit}>ml</Text>
          </Pressable>
        ))}
      </View>
      <TextField
        label="Ya apni matra (ml)"
        value={custom}
        onChangeText={setCustom}
        error={fieldError}
        keyboardType="number-pad"
        placeholder="jaise 300"
        returnKeyType="done"
        onSubmitEditing={saveCustom}
      />
      <Button title="Save" onPress={saveCustom} loading={busy && !QUICK_AMOUNTS.some((q) => q === savingAmount)} disabled={busy} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  quickRow: { flexDirection: 'row', gap: spacing.sm },
  quick: {
    flex: 1,
    minHeight: MIN_TOUCH_TARGET + 16,
    borderRadius: radius.md,
    backgroundColor: colors.waterSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickValue: { ...typography.subheading, color: colors.water },
  quickUnit: { ...typography.caption, color: colors.water },
});
