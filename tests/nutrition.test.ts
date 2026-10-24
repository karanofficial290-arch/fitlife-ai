import { formatNumber, summarizeMeals } from '../features/nutrition/nutritionLogic';
import { parseMealForm } from '../features/nutrition/mealValidation';

describe('summarizeMeals', () => {
  it('returns zeros for no meals', () => {
    expect(summarizeMeals([])).toEqual({
      calories: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      percent: { protein: 0, carbs: 0, fat: 0 },
    });
  });

  it('adds meals and splits energy by macro', () => {
    const s = summarizeMeals([
      { calories: 400, protein_g: 30, carbs_g: 40, fat_g: 10 },
      { calories: 600, protein_g: 20, carbs_g: 60, fat_g: 20 },
    ]);
    expect(s.calories).toBe(1000);
    expect([s.protein_g, s.carbs_g, s.fat_g]).toEqual([50, 100, 30]);
    // 200 + 400 + 270 kcal = 870 → 23% / 46% / 31%
    expect(s.percent).toEqual({ protein: 23, carbs: 46, fat: 31 });
    expect(s.percent.protein + s.percent.carbs + s.percent.fat).toBe(100);
  });

  it('accepts numeric strings from the database', () => {
    const s = summarizeMeals([{ calories: 100, protein_g: '5.5' as unknown as number, carbs_g: 0, fat_g: 0 }]);
    expect(s.protein_g).toBe(5.5);
  });
});

describe('formatNumber', () => {
  it('adds thousands separators', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(820)).toBe('820');
    expect(formatNumber(1350)).toBe('1,350');
    expect(formatNumber(10000)).toBe('10,000');
  });
});

describe('parseMealForm', () => {
  const base = { name: 'Dal chawal', mealType: 'lunch', portion: '1 plate', calories: '450', protein: '14', carbs: '70', fat: '9' };

  it('accepts a valid meal', () => {
    const r = parseMealForm(base);
    expect(r.errors).toEqual({});
    expect(r.value).toEqual({ name: 'Dal chawal', meal_type: 'lunch', portion: '1 plate', calories: 450, protein_g: 14, carbs_g: 70, fat_g: 9 });
  });

  it('allows empty macros and portion', () => {
    const r = parseMealForm({ ...base, portion: ' ', protein: '', carbs: '', fat: '' });
    expect(r.value).toEqual({ name: 'Dal chawal', meal_type: 'lunch', portion: null, calories: 450, protein_g: 0, carbs_g: 0, fat_g: 0 });
  });

  it('rejects missing name, bad meal type and out-of-range numbers', () => {
    const r = parseMealForm({ ...base, name: ' ', mealType: 'brunch', calories: '6000', protein: '-1' });
    expect(r.value).toBeNull();
    expect(Object.keys(r.errors).sort()).toEqual(['calories', 'mealType', 'name', 'protein']);
  });
});
