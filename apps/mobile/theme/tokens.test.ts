import { describe, expect, it } from "vitest";

import {
  colorTokens,
  colors,
  colorsFor,
  fontFamily,
  radius,
  spacing,
  typography,
  type ColorName,
} from "./tokens";

const HEX = /^#[0-9a-f]{6}([0-9a-f]{2})?$/;

describe("colorTokens", () => {
  it("todo color tiene valor claro y oscuro en hexadecimal", () => {
    for (const [name, value] of Object.entries(colorTokens)) {
      expect(value.light, `${name}.light`).toMatch(HEX);
      expect(value.dark, `${name}.dark`).toMatch(HEX);
    }
  });

  it("colorsFor arma la paleta de cada esquema", () => {
    const light = colorsFor("light");
    const dark = colorsFor("dark");
    const names = Object.keys(colorTokens) as ColorName[];
    expect(Object.keys(light)).toEqual(names);
    expect(Object.keys(dark)).toEqual(names);
    expect(light.bg).toBe("#f3f5ef");
    expect(dark.bg).toBe("#0b1a14");
    expect(light.ink).not.toBe(dark.ink);
  });

  it("colors expone ambos esquemas ya armados", () => {
    expect(colors.light).toEqual(colorsFor("light"));
    expect(colors.dark).toEqual(colorsFor("dark"));
  });
});

describe("typography", () => {
  it("usa solo las familias que carga expo-font", () => {
    const families = Object.values(fontFamily) as string[];
    for (const [name, style] of Object.entries(typography)) {
      expect(families, `${name}.fontFamily`).toContain(style.fontFamily);
    }
  });

  it("el interlineado nunca es menor que el tamano", () => {
    for (const [name, style] of Object.entries(typography)) {
      expect(style.lineHeight, name).toBeGreaterThanOrEqual(style.fontSize);
    }
  });

  it("los display son Barlow Condensed y el resto Inter", () => {
    for (const [name, style] of Object.entries(typography)) {
      const isDisplay = name.startsWith("display");
      expect(style.fontFamily.startsWith("BarlowCondensed"), name).toBe(isDisplay);
    }
  });
});

describe("escalas", () => {
  it("el espaciado base crece de s1 a s14", () => {
    const scale = [spacing.s1, spacing.s2, spacing.s3, spacing.s4, spacing.s5, spacing.s6, spacing.s8, spacing.s14];
    for (let i = 1; i < scale.length; i++) {
      expect(scale[i]).toBeGreaterThan(scale[i - 1]);
    }
  });

  it("los radios crecen de sm a pill", () => {
    const scale = [radius.sm, radius.md, radius.field, radius.lg, radius.xl, radius.pill];
    for (let i = 1; i < scale.length; i++) {
      expect(scale[i]).toBeGreaterThan(scale[i - 1]);
    }
  });
});
