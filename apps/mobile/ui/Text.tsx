import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { useTheme, type ColorName, type TypographyName } from "@/theme";

export type TextProps = RNTextProps & {
  variant?: TypographyName;
  color?: ColorName;
  align?: "left" | "center" | "right";
  uppercase?: boolean;
};

export const Text = ({
  variant = "body",
  color = "ink",
  align,
  uppercase,
  style,
  ...rest
}: TextProps) => {
  const t = useTheme();
  return (
    <RNText
      {...rest}
      style={[
        t.typography[variant],
        { color: t.colors[color] },
        align !== undefined && { textAlign: align },
        uppercase && { textTransform: "uppercase" },
        style,
      ]}
    />
  );
};
