import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { FormMessage } from '@/components/ui/FormMessage';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { TextField } from '@/components/ui/TextField';
import { spacing } from '@/constants/theme';

import { MEAL_LABELS, MEAL_TYPES, mealTypeForTime, parseMealForm, type MealType } from '../mealValidation';
import { logMeal } from '../nutritionService';

type Props = { visible: boolean; userId: string; onClose: () => void; onSaved: () => void };

const OPTIONS = MEAL_TYPES.map((t) => ({ value: t, label: MEAL_LABELS[t] }));

export function MealSheet({ visible, userId, onClose, onSaved }: Props) {
  const [mealType, setMealType] = useState<MealType>(() => mealTypeForTime(new Date()));
  const [name, setName] = useState('');
  const [portion, setPortion] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setMealType(mealTypeForTime(new Date()));
    setName('');
    setPortion('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setErrors({});
    setFormError(null);
  }, [visible]);

  async function save() {
    const parsed = parseMealForm({ name, mealType, portion, calories, protein, carbs, fat });
    setErrors(parsed.errors);
    setFormError(null);
    if (!parsed.value) return;
    setSaving(true);
    const result = await logMeal(userId, parsed.value, new Date());
    setSaving(false);
    if (result.error) {
      setFormError(result.error);
      return;
    }
    onSaved();
    onClose();
  }

  return (
    <BottomSheet visible={visible} title="Meal log karein" onClose={onClose}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FormMessage tone="error" message={formError} />
        <SegmentedControl options={OPTIONS} value={mealType} onChange={setMealType} accessibilityLabel="Meal type" />
        <TextField label="Kya khaya?" value={name} onChangeText={setName} error={errors.name} placeholder="jaise Dal chawal" />
        <TextField label="Portion (optional)" value={portion} onChangeText={setPortion} error={errors.portion} placeholder="jaise 1 plate" />
        <TextField
          label="Calories (kcal)"
          value={calories}
          onChangeText={setCalories}
          error={errors.calories}
          keyboardType="number-pad"
          placeholder="jaise 450"
        />
        <View style={styles.row}>
          <View style={styles.flex}>
            <TextField label="Protein g" value={protein} onChangeText={setProtein} error={errors.protein} keyboardType="decimal-pad" placeholder="0" />
          </View>
          <View style={styles.flex}>
            <TextField label="Carbs g" value={carbs} onChangeText={setCarbs} error={errors.carbs} keyboardType="decimal-pad" placeholder="0" />
          </View>
          <View style={styles.flex}>
            <TextField label="Fat g" value={fat} onChangeText={setFat} error={errors.fat} keyboardType="decimal-pad" placeholder="0" />
          </View>
        </View>
        <Button title="Save meal" onPress={save} loading={saving} />
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: { maxHeight: 520 },
  content: { gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
});
