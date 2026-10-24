// Single source of truth for FITMXO's visual identity (owner brief, 2026-10-24).
// Brand green #079669 is used for fills, rings and icons, and for button labels
// only at large bold size (3.77:1 passes AA for large text). Smaller green text
// uses `accentText` (#047857, ≥4.9:1).

export const colors = {
  background: '#F5F8FA',
  surface: '#FFFFFF',
  surfaceRaised: '#EEF3F6',
  border: '#E3EAF0',
  text: '#10233F',
  textMuted: '#5B6B7D',

  accent: '#079669',
  accentPressed: '#047857',
  /** Use for green text on `accentSoft` backgrounds. */
  accentText: '#047857',
  accentSoft: '#E6F6F0',
  onAccent: '#FFFFFF',

  water: '#1E6FC0',
  waterSoft: '#E6F0FB',
  calories: '#B45309',
  caloriesSoft: '#FDF1E3',
  purple: '#6D3FD1',
  purpleSoft: '#F0EAFC',
  steps: '#079669',

  danger: '#C62828',
  dangerSurface: '#FDECEC',
  success: '#047857',
  successSurface: '#E6F6F0',
  info: '#1E6FC0',
  infoSurface: '#E6F0FB',

  shadow: '#10233F',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: '800', lineHeight: 34 },
  heading: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  subheading: { fontSize: 17, fontWeight: '700', lineHeight: 22 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
} as const;

/** Soft card shadow that works on Android (elevation) and iOS. */
export const cardShadow = {
  shadowColor: colors.shadow,
  shadowOpacity: 0.07,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
} as const;

/** Minimum touch target recommended by Android accessibility guidelines. */
export const MIN_TOUCH_TARGET = 48;
