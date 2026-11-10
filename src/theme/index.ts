/**
 * The app's global styles: the marketing site's globals.css translated to React Native.
 * Screens and components take every colour, font, size and shadow from here. Corners are
 * square, as on the site's own buttons, fields and cards.
 */
import { StyleSheet } from 'react-native';

/**
 * The site's :root colours, as the sRGB values a browser shows for them (the site writes
 * them in OKLCH; the brand green is outside sRGB, so it is the browser's gamut-mapped value).
 */
export const colors = {
  background: '#fdfefc', // --background
  foreground: '#121918', // --foreground
  card: '#ffffff', // --card
  primary: '#00fc15', // --primary, the logo green
  primaryForeground: '#081008', // --primary-foreground: text on green
  muted: '#f0f5f3', // --muted
  mutedForeground: '#526161', // --muted-foreground
  accent: '#bdf7ff', // --accent
  accentForeground: '#0b1918', // --accent-foreground
  destructive: '#e7000b', // --destructive
  border: '#d9e0de', // --border and --input
  surface: '#f3f8f6', // --surface
  brandWash: '#ddfcf2', // --brand-wash
  overlay: 'rgba(6, 15, 15, 0.84)', // bg-video-overlay
  white: '#ffffff',
  // App states the site has no token for, derived from its palette.
  primaryPressed: '#00d912', // primary, slightly darker while pressed
  focusRing: 'rgba(0, 252, 21, 0.2)', // the site's focus outline: primary at 20%
  success: '#00a510', // primary, dark enough for a dot on light washes
  warningWash: '#fff1cc',
  warningText: '#5c3d00',
  warning: '#ffba00', // --chart-4
  dangerWash: '#fde5e6',
  dangerWashPressed: '#fbd3d5',
  dangerText: '#a1000a',
  info: '#009689', // --chart-2
} as const;

/** Manrope for text, Sora for headings, as on the site. Each weight is its own font file. */
export const fonts = {
  regular: 'Manrope-Regular',
  medium: 'Manrope-Medium',
  semiBold: 'Manrope-SemiBold',
  bold: 'Manrope-Bold',
  extraBold: 'Manrope-ExtraBold',
  display: 'Sora-Medium',
} as const;

/** A 4-point spacing scale. `gutter` matches the site's side padding on phones (1.25rem). */
export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  gutter: 20,
} as const;

/** shadow-editorial: 0 24px 60px -32px oklch(0.18 0.02 190 / 32%). */
export const shadow = {
  editorial: { boxShadow: '0px 24px 60px -32px rgba(7, 20, 19, 0.32)' },
} as const;

/** Touch targets: 44 points is the smallest comfortable one; CTAs are min-h-14 on the site. */
export const layout = {
  touch: 44,
  buttonHeight: 56,
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
} as const;

/** Text styles, named for what they are used for. Sizes follow the site at phone width. */
export const text = StyleSheet.create({
  display: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.45,
    color: colors.foreground,
  },
  // .section-title
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 29,
    letterSpacing: -0.36,
    color: colors.foreground,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 24,
    color: colors.foreground,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.foreground,
  },
  bodyStrong: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.foreground,
  },
  small: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.mutedForeground,
  },
  smallStrong: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.foreground,
  },
  caption: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: colors.mutedForeground,
  },
  // .eyebrow
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.88,
    textTransform: 'uppercase',
    color: colors.mutedForeground,
  },
  // .form-label
  label: {
    fontFamily: fonts.extraBold,
    fontSize: 11.5,
    lineHeight: 16,
    letterSpacing: 0.46,
    textTransform: 'uppercase',
    color: colors.foreground,
  },
  button: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 18 },
  link: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.foreground,
    textDecorationLine: 'underline',
  },
});

export type TextVariant = keyof typeof text;

// .form-input, in two parts. A text field puts the border and focus ring on a box around its
// input, so the input itself never changes style: on Android that would reset its padding.
const formInputBox = {
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.background,
};
const formInputText = {
  paddingVertical: 14,
  paddingHorizontal: space.md,
  fontFamily: fonts.medium,
  fontSize: 15,
  color: colors.foreground,
};

/** The site's small utilities that are not text styles. */
export const styles = StyleSheet.create({
  // body: the page background
  screen: { flex: 1, backgroundColor: colors.background },
  // .eyebrow > span: the 2rem by 2px green bar before an eyebrow label
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  eyebrowBar: { width: 32, height: 2, backgroundColor: colors.primary },
  formInputBox,
  formInputText,
  // Both parts, for fields that open a picker and for search boxes.
  formInput: { ...formInputBox, ...formInputText },
  // .form-input:focus
  formInputFocused: {
    borderColor: colors.primary,
    boxShadow: `0px 0px 0px 3px ${colors.focusRing}`,
  },
  formInputInvalid: { borderColor: colors.destructive },
  // The green square bullet the site uses in lists (size-1.5 bg-primary)
  bullet: { width: 6, height: 6, backgroundColor: colors.primary },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
});
