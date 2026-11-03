import { colors, radius, shadow, spacing, stroke, typography, type Colors, type Scheme } from "./tokens";

export type Theme = {
  scheme: Scheme;
  colors: Colors;
  spacing: typeof spacing;
  radius: typeof radius;
  stroke: typeof stroke;
  typography: typeof typography;
  shadow: typeof shadow;
};

export const createTheme = (scheme: Scheme): Theme => {
  return {
    scheme,
    colors: colors[scheme],
    spacing,
    radius,
    stroke,
    typography,
    shadow,
  };
};

export const themes: Record<Scheme, Theme> = {
  light: createTheme("light"),
  dark: createTheme("dark"),
};
