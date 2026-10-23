// Single source of truth for FitMxo's visual identity (light, green-accented).
// Every text/background pair used in the app meets WCAG AA (4.5:1) — checked 2026-10-23.

export const colors = {
  background: '#F3F7F5',
  surface: '#FFFFFF',
  surfaceRaised: '#EEF4F1',
  border: '#E1EAE5',
  text: '#0F2233',
  textMuted: '#5A6B78',

  accent: '#14804A',
  accentPressed: '#0F6E3F',
  /** Use for green text on `accentSoft` backgrounds. */
  accentText: '#0F6E3F',
  accentSoft: '#E4F4EA',
  onAccent: '#FFFFFF',

  water: '#1E6FC0',
  waterSoft: '#E6F0FB',
  calories: '#B45309',
  caloriesSoft: '#FDF1E3',
  purple: '#6D3FD1',
  purpleSoft: '#F0EAFC',
  steps: '#14804A',

  danger: '#C62828',
  dangerSurface: '#FDECEC',
  success: '#14804A',
  successSurface: '#E4F4EA',
  info: '#1E6FC0',
  infoSurface: '#E6F0FB',

  shadow: '#0F2233',
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
  sm: 8,
  md: 12,
  lg: 18,
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
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
} as const;

/** Minimum touch target recommended by Android accessibility guidelines. */
export const MIN_TOUCH_TARGET = 48;
