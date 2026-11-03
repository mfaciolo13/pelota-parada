import { View, type ViewProps } from "react-native";

import { makeStyles, type ColorName } from "@/theme";

import { Text } from "./Text";

export type ChipTone = "ok" | "warn" | "bad" | "info" | "neutral" | "lime" | "glass";

export type ChipProps = ViewProps & {
  label: string;
  tone?: ChipTone;
};

const TONES: Record<ChipTone, { bg: ColorName; fg: ColorName }> = {
  ok: { bg: "okBg", fg: "okFg" },
  warn: { bg: "warnBg", fg: "warnFg" },
  bad: { bg: "badBg", fg: "badFg" },
  info: { bg: "infoBg", fg: "infoFg" },
  neutral: { bg: "neutralBg", fg: "neutralFg" },
  lime: { bg: "lime", fg: "ink2" },
  glass: { bg: "onPitchGlass", fg: "onPitch" },
};

const useStyles = makeStyles((t) => ({
  base: {
    alignSelf: "flex-start",
    borderRadius: t.radius.pill,
    paddingHorizontal: t.spacing.s2 + 2,
    paddingVertical: t.spacing.s1,
  },
  ok: { backgroundColor: t.colors.okBg },
  warn: { backgroundColor: t.colors.warnBg },
  bad: { backgroundColor: t.colors.badBg },
  info: { backgroundColor: t.colors.infoBg },
  neutral: { backgroundColor: t.colors.neutralBg },
  lime: { backgroundColor: t.colors.lime },
  glass: { backgroundColor: t.colors.onPitchGlass },
}));

export const Chip = ({ label, tone = "neutral", style, ...rest }: ChipProps) => {
  const styles = useStyles();
  return (
    <View {...rest} style={[styles.base, styles[tone], style]}>
      <Text variant="label" color={TONES[tone].fg}>
        {label}
      </Text>
    </View>
  );
};
