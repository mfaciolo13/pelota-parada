import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { makeStyles, useTheme, type ColorName, type Theme } from "@/theme";

import { Text } from "./Text";

export type ButtonVariant = "primary" | "lime" | "outline" | "soft" | "danger" | "ghost" | "glass";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<PressableProps, "style" | "children"> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

type Appearance = { bg: ColorName | "transparent"; fg: ColorName; border?: ColorName };

const APPEARANCE: Record<ButtonVariant, Appearance> = {
  primary: { bg: "greenFill", fg: "onGreen" },
  lime: { bg: "lime", fg: "ink2" },
  outline: { bg: "transparent", fg: "green", border: "green" },
  soft: { bg: "badBg", fg: "badFg" },
  danger: { bg: "badFg", fg: "badBg" },
  ghost: { bg: "chipBg", fg: "mute" },
  glass: { bg: "onPitchGlass", fg: "onPitch" },
};

type Sizing = { minHeight: number; paddingHorizontal: keyof Theme["spacing"]; fontSize: number };

const SIZES: Record<ButtonSize, Sizing> = {
  sm: { minHeight: 32, paddingHorizontal: "s3", fontSize: 13 },
  md: { minHeight: 40, paddingHorizontal: "s4", fontSize: 14 },
  lg: { minHeight: 48, paddingHorizontal: "s5", fontSize: 15 },
};

const useStyles = makeStyles((t) => ({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: t.spacing.s2,
    borderRadius: t.radius.pill,
    borderWidth: t.stroke.field,
    borderColor: "transparent",
  },
  fullWidth: { alignSelf: "stretch" },
  pressed: { opacity: 0.85 },
  inactive: { opacity: 0.45 },
}));

export const Button = ({
  label,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) => {
  const t = useTheme();
  const styles = useStyles();
  const appearance = APPEARANCE[variant];
  const sizing = SIZES[size];
  const inactive = disabled || loading;
  const textColor = t.colors[appearance.fg];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: loading }}
      disabled={inactive}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: sizing.minHeight,
          paddingHorizontal: t.spacing[sizing.paddingHorizontal],
          backgroundColor: appearance.bg === "transparent" ? "transparent" : t.colors[appearance.bg],
          borderColor: appearance.border ? t.colors[appearance.border] : "transparent",
        },
        fullWidth && styles.fullWidth,
        pressed && !inactive && styles.pressed,
        inactive && styles.inactive,
        style,
      ]}
    >
      {loading && <ActivityIndicator size="small" color={textColor} />}
      <Text variant="button" color={appearance.fg} style={{ fontSize: sizing.fontSize }}>
        {label}
      </Text>
    </Pressable>
  );
};
