import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { FormMessage } from '@/components/ui/FormMessage';
import { TextField } from '@/components/ui/TextField';
import { colors, typography } from '@/constants/theme';

import { logWeight, saveGoalWeight } from '../trackingService';
import { parseWeightKg } from '../trackingValidation';

export type WeightSheetMode = 'log' | 'goal';

type Props = {
  mode: WeightSheetMode | null;
  userId: string;
  initialValue?: number | null;
  onClose: () => void;
  onSaved: () => void;
};

export function WeightSheet({ mode, userId, initialValue, onClose, onSaved }: Props) {
  const [value, setValue] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode) {
      setValue(initialValue != null ? String(initialValue) : '');
      setFieldError(null);
      setError(null);
    }
  }, [mode, initialValue]);

  async function save() {
    if (!mode) return;
    const parsed = parseWeightKg(value);
    setFieldError(parsed.error);
    if (parsed.value === null) return;

    setSaving(true);
    setError(null);
    const result =
      mode === 'goal' ? await saveGoalWeight(userId, parsed.value) : await logWeight(userId, parsed.value, new Date());
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onSaved();
    onClose();
  }

  const isGoal = mode === 'goal';

  return (
    <BottomSheet visible={mode !== null} title={isGoal ? 'Goal weight set karein' : 'Aaj ka weight'} onClose={onClose}>
      <Text style={styles.hint}>
        {isGoal
          ? 'Ek realistic goal rakhein. Healthy pace aam taur par hafte mein 0.25–1 kg hota hai.'
          : 'Ek din mein ek entry rakhi jaati hai — dobara save karne se aaj ki entry update ho jayegi.'}
      </Text>
      <FormMessage tone="error" message={error} />
      <TextField
        label="Weight (kg)"
        value={value}
        onChangeText={setValue}
        error={fieldError}
        keyboardType="decimal-pad"
        placeholder="jaise 72.5"
        returnKeyType="done"
        onSubmitEditing={save}
      />
      <Button title="Save" onPress={save} loading={saving} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  hint: { ...typography.caption, color: colors.textMuted },
});
