import { useState } from "react";
import {
  Platform,
  TextInput,
  View,
  type StyleProp,
  type TextInputFocusEvent,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { makeStyles, useTheme } from "@/theme";

import { Text } from "./Text";

export type FieldProps = Omit<TextInputProps, "style"> & {
  label: string;
  hint?: string;
  error?: string;
  prefix?: string;
  maxLength?: number;
  style?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  container: { gap: t.spacing.s1 + 2 },
  box: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: t.spacing.touch,
    paddingHorizontal: t.spacing.s3,
    borderRadius: t.radius.field,
    borderWidth: t.stroke.field,
    borderColor: t.colors.fieldBorder,
    backgroundColor: t.colors.card,
  },
  boxMultiline: { minHeight: 96, alignItems: "flex-start", paddingVertical: t.spacing.s2 },
  boxFocused: { borderColor: t.colors.focus },
  boxError: { borderColor: t.colors.badFg },
  boxDisabled: { opacity: 0.6 },
  input: {
    flex: 1,
    ...t.typography.body,
    fontSize: 15,
    color: t.colors.ink,
    paddingVertical: t.spacing.s2,
    // `none` no esta en los tipos de RN.
    ...Platform.select({ web: { outlineStyle: "none" } as unknown as TextStyle }),
  },
  inputMultiline: { textAlignVertical: "top", minHeight: 80 },
  prefix: { marginRight: t.spacing.s1 },
  footer: { flexDirection: "row", justifyContent: "space-between", gap: t.spacing.s2 },
  footerText: { flex: 1 },
}));

export const Field = ({
  label,
  hint,
  error,
  prefix,
  maxLength,
  multiline,
  style,
  value,
  onFocus,
  onBlur,
  editable,
  ...rest
}: FieldProps) => {
  const t = useTheme();
  const styles = useStyles();
  const [focused, setFocused] = useState(false);
  const showCounter = multiline && maxLength !== undefined;
  const footer = error ?? hint;

  const handleFocus = (e: TextInputFocusEvent) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: TextInputFocusEvent) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, style]}>
      <Text variant="label" color="ink">
        {label}
      </Text>
      <View
        style={[
          styles.box,
          multiline && styles.boxMultiline,
          focused && styles.boxFocused,
          !!error && styles.boxError,
          editable === false && styles.boxDisabled,
        ]}
      >
        {prefix !== undefined && (
          <Text variant="title" color="mute" style={styles.prefix}>
            {prefix}
          </Text>
        )}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={t.colors.mute}
          selectionColor={t.colors.focus}
          {...rest}
          value={value}
          multiline={multiline}
          maxLength={maxLength}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[styles.input, multiline && styles.inputMultiline]}
        />
      </View>
      {(footer !== undefined || showCounter) && (
        <View style={styles.footer}>
          <Text variant="secondary" color={error ? "badFg" : "mute"} style={styles.footerText}>
            {footer ?? ""}
          </Text>
          {showCounter && (
            <Text variant="label" color="mute">
              {(value ?? "").length} / {maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};
