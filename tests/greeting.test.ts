import { getGreeting } from '../utils/greeting';

const at = (hour: number) => new Date(2026, 0, 1, hour, 0, 0);

describe('getGreeting', () => {
  it('greets by time of day', () => {
    expect(getGreeting(at(4))).toBe('Good evening');
    expect(getGreeting(at(5))).toBe('Good morning');
    expect(getGreeting(at(11))).toBe('Good morning');
    expect(getGreeting(at(12))).toBe('Good afternoon');
    expect(getGreeting(at(16))).toBe('Good afternoon');
    expect(getGreeting(at(17))).toBe('Good evening');
    expect(getGreeting(at(23))).toBe('Good evening');
  });
});
