// Validates the meal form against the same limits as the meal_logs table.

export const MEAL_TYPES = ['breakfast', 'lunch', 'snacks', 'dinner'] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snacks: 'Snacks',
  dinner: 'Dinner',
};

export type MealFormInput = {
  name: string;
  mealType: string;
  portion: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

export type MealInsert = {
  name: string;
  meal_type: MealType;
  portion: string | null;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

type Field = 'name' | 'mealType' | 'portion' | 'calories' | 'protein' | 'carbs' | 'fat';

function parseNumber(text: string, max: number, required: boolean, decimals: boolean): { value: number | null; error: string | null } {
  const t = text.trim().replace(',', '.');
  if (!t) return required ? { value: null, error: 'Zaroori hai.' } : { value: 0, error: null };
  const pattern = decimals ? /^\d{1,4}(\.\d)?$/ : /^\d{1,4}$/;
  if (!pattern.test(t)) return { value: null, error: decimals ? 'Number daalein, jaise 12.5' : 'Poora number daalein' };
  const n = Number(t);
  if (n < 0 || n > max) return { value: null, error: `0–${max} ke beech daalein.` };
  return { value: n, error: null };
}

export function isMealType(value: string): value is MealType {
  return (MEAL_TYPES as readonly string[]).includes(value);
}

export function parseMealForm(input: MealFormInput): { value: MealInsert | null; errors: Partial<Record<Field, string>> } {
  const errors: Partial<Record<Field, string>> = {};
  const name = input.name.trim();
  if (!name) errors.name = 'Khane ka naam daalein.';
  else if (name.length > 120) errors.name = 'Naam 120 characters se chhota rakhein.';

  if (!isMealType(input.mealType)) errors.mealType = 'Meal chunein.';

  const portion = input.portion.trim();
  if (portion.length > 60) errors.portion = 'Portion 60 characters se chhota rakhein.';

  const calories = parseNumber(input.calories, 5000, true, false);
  const protein = parseNumber(input.protein, 500, false, true);
  const carbs = parseNumber(input.carbs, 1000, false, true);
  const fat = parseNumber(input.fat, 500, false, true);
  if (calories.error) errors.calories = calories.error;
  if (protein.error) errors.protein = protein.error;
  if (carbs.error) errors.carbs = carbs.error;
  if (fat.error) errors.fat = fat.error;

  if (Object.keys(errors).length > 0) return { value: null, errors };
  return {
    value: {
      name,
      meal_type: input.mealType as MealType,
      portion: portion || null,
      calories: calories.value ?? 0,
      protein_g: protein.value ?? 0,
      carbs_g: carbs.value ?? 0,
      fat_g: fat.value ?? 0,
    },
    errors,
  };
}

/** Meal type that matches the time of day, used as the form default. */
export function mealTypeForTime(date: Date): MealType {
  const h = date.getHours();
  if (h < 11) return 'breakfast';
  if (h < 16) return 'lunch';
  if (h < 19) return 'snacks';
  return 'dinner';
}
