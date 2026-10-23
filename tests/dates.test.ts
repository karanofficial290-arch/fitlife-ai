import {
  addDays,
  dayOfYear,
  formatClock,
  isSameLocalDay,
  startOfLocalDay,
  startOfWeekMonday,
  toLocalDateString,
  weekdayIndexMonday,
} from '../utils/dates';

describe('date helpers', () => {
  it('startOfLocalDay drops the time', () => {
    const d = startOfLocalDay(new Date(2026, 9, 23, 18, 45));
    expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes()]).toEqual([2026, 9, 23, 0, 0]);
  });

  it('weeks start on Monday', () => {
    // 2026-10-23 is a Friday
    expect(weekdayIndexMonday(new Date(2026, 9, 23))).toBe(4);
    expect(toLocalDateString(startOfWeekMonday(new Date(2026, 9, 23, 9)))).toBe('2026-10-19');
    // Sunday belongs to the week that started the previous Monday
    expect(toLocalDateString(startOfWeekMonday(new Date(2026, 9, 25)))).toBe('2026-10-19');
    expect(toLocalDateString(startOfWeekMonday(new Date(2026, 9, 19)))).toBe('2026-10-19');
  });

  it('addDays crosses month and year boundaries', () => {
    expect(toLocalDateString(addDays(new Date(2026, 9, 31), 1))).toBe('2026-11-01');
    expect(toLocalDateString(addDays(new Date(2026, 11, 31), 1))).toBe('2027-01-01');
  });

  it('formats local dates with zero padding', () => {
    expect(toLocalDateString(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('dayOfYear is 1-based', () => {
    expect(dayOfYear(new Date(2026, 0, 1))).toBe(1);
    expect(dayOfYear(new Date(2026, 11, 31))).toBe(365);
  });

  it('isSameLocalDay compares calendar days', () => {
    expect(isSameLocalDay(new Date(2026, 9, 23, 0, 1), new Date(2026, 9, 23, 23, 59))).toBe(true);
    expect(isSameLocalDay(new Date(2026, 9, 23, 23, 59), new Date(2026, 9, 24, 0, 1))).toBe(false);
  });

  it('formatClock shows mm:ss and h:mm:ss', () => {
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(75)).toBe('01:15');
    expect(formatClock(3725)).toBe('1:02:05');
    expect(formatClock(-5)).toBe('00:00');
  });
});
