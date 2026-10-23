import { formatWater, parseWaterMl, parseWeightKg } from '../features/tracking/trackingValidation';
import { clampProgress, percent, ratio } from '../utils/progress';
import { firstName, initials } from '../utils/text';

describe('parseWeightKg', () => {
  it('accepts dot or comma decimals within range', () => {
    expect(parseWeightKg('72').value).toBe(72);
    expect(parseWeightKg(' 72.5 ').value).toBe(72.5);
    expect(parseWeightKg('72,25').value).toBe(72.25);
  });

  it('rejects bad input and out-of-range values', () => {
    expect(parseWeightKg('').error).not.toBeNull();
    expect(parseWeightKg('abc').error).not.toBeNull();
    expect(parseWeightKg('72.555').error).not.toBeNull();
    expect(parseWeightKg('19').error).not.toBeNull();
    expect(parseWeightKg('401').error).not.toBeNull();
  });
});

describe('parseWaterMl', () => {
  it('accepts whole ml values from 1 to 5000', () => {
    expect(parseWaterMl('250').value).toBe(250);
    expect(parseWaterMl('0').error).not.toBeNull();
    expect(parseWaterMl('5001').error).not.toBeNull();
    expect(parseWaterMl('2.5').error).not.toBeNull();
  });
});

describe('formatWater', () => {
  it('uses litres from 1000 ml', () => {
    expect(formatWater(750)).toBe('750 ml');
    expect(formatWater(1500)).toBe('1.5 L');
    expect(formatWater(3000)).toBe('3 L');
  });
});

describe('progress helpers', () => {
  it('clamps safely', () => {
    expect(clampProgress(Number.NaN)).toBe(0);
    expect(clampProgress(-1)).toBe(0);
    expect(clampProgress(1.4)).toBe(1);
    expect(ratio(1500, 3000)).toBe(0.5);
    expect(ratio(5, 0)).toBe(0);
    expect(percent(0.734)).toBe(73);
  });
});

describe('text helpers', () => {
  it('builds initials and first names', () => {
    expect(initials('Karan Singh Rathore')).toBe('KR');
    expect(initials('  karan ')).toBe('K');
    expect(initials(null)).toBe('FM');
    expect(firstName('Karan Singh')).toBe('Karan');
    expect(firstName('   ')).toBeNull();
  });
});
