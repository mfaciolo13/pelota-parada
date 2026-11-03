import { View, type ViewProps } from "react-native";

import { makeStyles, useTheme, type Theme } from "@/theme";

export type CardVariant = "default" | "raised" | "debt" | "active" | "dark" | "placeholder";

export type CardProps = ViewProps & {
  variant?: CardVariant;
  padding?: keyof Theme["spacing"] | "none";
};

const useStyles = makeStyles((t) => ({
  base: {
    borderRadius: t.radius.lg,
    borderWidth: t.stroke.hair,
    overflow: "hidden",
  },
  default: { backgroundColor: t.colors.card, borderColor: t.colors.line },
  raised: { backgroundColor: t.colors.card, borderColor: t.colors.lineSoft, ...t.shadow.raise },
  debt: { backgroundColor: t.colors.badBg, borderColor: t.colors.badBg },
  active: {
    backgroundColor: t.colors.card,
    borderColor: t.colors.green,
    borderWidth: t.stroke.field,
  },
  dark: { backgroundColor: t.colors.pitch, borderColor: t.colors.pitch },
  placeholder: {
    backgroundColor: "transparent",
    borderColor: t.colors.fieldBorder,
    borderStyle: "dashed",
  },
}));

export const Card = ({ variant = "default", padding = "s4", style, ...rest }: CardProps) => {
  const t = useTheme();
  const styles = useStyles();
  return (
    <View
      {...rest}
      style={[
        styles.base,
        styles[variant],
        padding !== "none" && { padding: t.spacing[padding] },
        style,
      ]}
    />
  );
};
