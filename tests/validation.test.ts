import {
  normalizeEmail,
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
