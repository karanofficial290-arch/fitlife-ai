import {
  formatDobInput,
  normalizeEmail,
  parseDob,
  parsePhone,
  validateDisplayName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
} from '../features/auth/validation';

describe('validateEmail', () => {
  it('rejects empty and malformed emails', () => {
    expect(validateEmail('')).not.toBeNull();
    expect(validateEmail('   ')).not.toBeNull();
    expect(validateEmail('karan')).not.toBeNull();
    expect(validateEmail('karan@gmail')).not.toBeNull();
    expect(validateEmail('kar an@gmail.com')).not.toBeNull();
  });

  it('accepts valid emails, ignoring surrounding spaces', () => {
    expect(validateEmail('karan@gmail.com')).toBeNull();
    expect(validateEmail('  user.name+tag@example.co.in ')).toBeNull();
  });
});

describe('validatePassword', () => {
  it('requires at least 8 characters with a letter and a number', () => {
    expect(validatePassword('')).not.toBeNull();
    expect(validatePassword('abc123')).not.toBeNull();
    expect(validatePassword('abcdefgh')).not.toBeNull();
    expect(validatePassword('12345678')).not.toBeNull();
    expect(validatePassword('fitness2026')).toBeNull();
  });
});

describe('validatePasswordConfirmation', () => {
  it('requires a matching confirmation', () => {
    expect(validatePasswordConfirmation('fitness2026', '')).not.toBeNull();
    expect(validatePasswordConfirmation('fitness2026', 'fitness2025')).not.toBeNull();
    expect(validatePasswordConfirmation('fitness2026', 'fitness2026')).toBeNull();
  });
});

describe('validateDisplayName', () => {
  it('requires a non-blank name of at most 60 characters', () => {
    expect(validateDisplayName('  ')).not.toBeNull();
    expect(validateDisplayName('a'.repeat(61))).not.toBeNull();
    expect(validateDisplayName(' Karan ')).toBeNull();
  });
});

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Karan@Gmail.COM ')).toBe('karan@gmail.com');
  });
});


describe('parsePhone', () => {
  it('is optional and normalizes Indian numbers', () => {
    expect(parsePhone('')).toEqual({ value: null, error: null });
    expect(parsePhone('98765 43210')).toEqual({ value: '+919876543210', error: null });
    expect(parsePhone('+447911123456').value).toBe('+447911123456');
  });
  it('rejects malformed numbers', () => {
    expect(parsePhone('12345').error).not.toBeNull();
    expect(parsePhone('5876543210').error).not.toBeNull();
  });
});

describe('formatDobInput', () => {
  it('inserts slashes while typing', () => {
    expect(formatDobInput('1')).toBe('1');
    expect(formatDobInput('1405')).toBe('14/05');
    expect(formatDobInput('14051998')).toBe('14/05/1998');
    expect(formatDobInput('14/05/19985')).toBe('14/05/1998');
  });
});

describe('parseDob', () => {
  const today = new Date(2026, 9, 24);
  it('accepts a real date for someone 13 or older', () => {
    expect(parseDob('14/05/1998', today)).toEqual({ value: '1998-05-14', error: null });
    expect(parseDob('24/10/2013', today).value).toBe('2013-10-24');
  });
  it('rejects impossible dates, wrong format and under-13s', () => {
    expect(parseDob('31/02/2000', today).error).not.toBeNull();
    expect(parseDob('1998-05-14', today).error).not.toBeNull();
    expect(parseDob('25/10/2013', today).error).not.toBeNull();
  });
});
