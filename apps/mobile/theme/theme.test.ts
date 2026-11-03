import { describe, expect, it } from "vitest";

import { createTheme, themes } from "./theme";
import { colors, spacing, typography } from "./tokens";

describe("createTheme", () => {
  it("arma el tema claro con la paleta clara", () => {
    const theme = createTheme("light");
    expect(theme.scheme).toBe("light");
    expect(theme.colors).toEqual(colors.light);
    expect(theme.spacing).toBe(spacing);
    expect(theme.typography).toBe(typography);
  });

  it("arma el tema oscuro con la paleta oscura", () => {
    const theme = createTheme("dark");
    expect(theme.scheme).toBe("dark");
    expect(theme.colors).toEqual(colors.dark);
  });

  it("themes expone los dos esquemas", () => {
    expect(themes.light.colors.card).toBe("#ffffff");
    expect(themes.dark.colors.card).toBe("#10261e");
  });
});
