// Tokens de la pagina "Tokens" del Figma: https://www.figma.com/design/rHZdibYb6E9orNdce1Y2Qm/POTRERO?node-id=1-99

export type Scheme = "light" | "dark";

export const colorTokens = {
  bg: { light: "#f3f5ef", dark: "#0b1a14" },
  card: { light: "#ffffff", dark: "#10261e" },
  ink: { light: "#10201a", dark: "#eef3ec" },
  mute: { light: "#5c6b62", dark: "#9fb3a8" },
  line: { light: "#e3e8e0", dark: "#1f3a30" },
  lineSoft: { light: "#edf0e9", dark: "#183129" },
  chipBg: { light: "#eef1ea", dark: "#1a2c25" },
  fieldBorder: { light: "#d9e0d6", dark: "#2a473b" },
  pitch: { light: "#0d3b2e", dark: "#0d3b2e" },
  pitchDeep: { light: "#082a21", dark: "#06201a" },
  ink2: { light: "#10201a", dark: "#060e0b" },
  onPitch: { light: "#ffffff", dark: "#ffffff" },
  onPitchMute: { light: "#b9cfc3", dark: "#b9cfc3" },
  onPitchGlass: { light: "#ffffff1f", dark: "#ffffff1f" },
  lime: { light: "#c9f566", dark: "#c9f566" },
  green: { light: "#0f6b3f", dark: "#5bc48a" },
  greenFill: { light: "#0f6b3f", dark: "#0f6b3f" },
  onGreen: { light: "#ffffff", dark: "#ffffff" },
  okFg: { light: "#0f6b3f", dark: "#9be07a" },
  okBg: { light: "#e4f6d3", dark: "#14301f" },
  warnFg: { light: "#7a4204", dark: "#f5c56b" },
  warnBg: { light: "#fff4d6", dark: "#3a2a0d" },
  badFg: { light: "#9a2a1d", dark: "#f3a092" },
  badBg: { light: "#fde6e2", dark: "#3e1511" },
  infoFg: { light: "#1d4ed8", dark: "#9db8ff" },
  infoBg: { light: "#e8efff", dark: "#16234a" },
  neutralFg: { light: "#5c6b62", dark: "#9fb3a8" },
  neutralBg: { light: "#eef1ea", dark: "#1a2c25" },
  star: { light: "#f2c200", dark: "#f2c200" },
  cardRed: { light: "#d92d20", dark: "#f0584c" },
  focus: { light: "#0f6b3f", dark: "#c9f566" },
} as const;

export type ColorName = keyof typeof colorTokens;
export type Colors = Record<ColorName, string>;

export const colorsFor = (scheme: Scheme): Colors => {
  const entries = Object.entries(colorTokens) as [ColorName, { light: string; dark: string }][];
  return Object.fromEntries(entries.map(([name, value]) => [name, value[scheme]])) as Colors;
};

export const colors: Record<Scheme, Colors> = {
  light: colorsFor("light"),
  dark: colorsFor("dark"),
};

export const spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 20,
  s6: 24,
  s8: 32,
  s14: 56,
  touch: 44,
  tabBottom: 22,
  webContainer: 1160,
} as const;

export const radius = {
  sm: 9,
  md: 12,
  field: 14,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const stroke = {
  hair: 1,
  field: 1.5,
  icon: 2,
  iconSm: 2.2,
} as const;

export const fontFamily = {
  displayBold: "BarlowCondensed_700Bold",
  displayExtraBold: "BarlowCondensed_800ExtraBold",
  textRegular: "Inter_400Regular",
  textBold: "Inter_700Bold",
} as const;

export type TextStyleToken = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
};

export const typography = {
  displayGoals: { fontFamily: fontFamily.displayExtraBold, fontSize: 64, lineHeight: 64 },
  displayTime: { fontFamily: fontFamily.displayExtraBold, fontSize: 40, lineHeight: 40 },
  displayTitle: { fontFamily: fontFamily.displayExtraBold, fontSize: 30, lineHeight: 30 },
  displayTable: { fontFamily: fontFamily.displayExtraBold, fontSize: 22, lineHeight: 24 },
  displaySection: { fontFamily: fontFamily.displayBold, fontSize: 18, lineHeight: 22 },
  title: { fontFamily: fontFamily.textBold, fontSize: 15, lineHeight: 20 },
  button: { fontFamily: fontFamily.textBold, fontSize: 14, lineHeight: 20 },
  body: { fontFamily: fontFamily.textRegular, fontSize: 14, lineHeight: 20 },
  secondary: { fontFamily: fontFamily.textRegular, fontSize: 12, lineHeight: 17 },
  label: { fontFamily: fontFamily.textBold, fontSize: 11, lineHeight: 14 },
  overline: { fontFamily: fontFamily.textBold, fontSize: 10, lineHeight: 14 },
} as const satisfies Record<string, TextStyleToken>;

export type TypographyName = keyof typeof typography;

export const shadow = {
  raise: {
    boxShadow: "0 4px 12px rgba(16, 32, 26, 0.08)",
    elevation: 3,
  },
} as const;
