// Single source of truth for FitMxo's visual identity.
// Text colours are chosen for WCAG AA contrast on `background` and `surface`.

export const colors = {
  background: '#0B0F14',
  surface: '#141A22',
  surfaceRaised: '#1C2430',
  border: '#263040',
  text: '#F2F5F8',
  textMuted: '#9AA6B5',
  accent: '#3DDC97',
  accentPressed: '#2FB57C',
  onAccent: '#062A1B',
  danger: '#FF6B6B',
  dangerSurface: '#2A1518',
  success: '#3DDC97',
  successSurface: '#0F2A20',
  info: '#6CB8FF',
  infoSurface: '#10212F',
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
  lg: 16,
  pill: 999,
} as const;

export const typography = {
  title: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
  heading: { fontSize: 20, fontWeight: '700', lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
} as const;

/** Minimum touch target recommended by Android accessibility guidelines. */
export const MIN_TOUCH_TARGET = 48;
