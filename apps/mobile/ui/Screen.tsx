import { StatusBar } from "expo-status-bar";
import type { ReactNode } from "react";
import { Platform, ScrollView, View, type StyleProp, type ViewStyle } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { makeStyles, useTheme } from "@/theme";

export type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  edges?: readonly Edge[];
  contentStyle?: StyleProp<ViewStyle>;
};

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.bg },
  content: {
    flexGrow: 1,
    padding: t.spacing.s4,
    paddingBottom: t.spacing.s4 + t.spacing.tabBottom,
    width: "100%",
    alignSelf: "center",
    maxWidth: Platform.OS === "web" ? t.spacing.webContainer : undefined,
  },
}));

export const Screen = ({ children, scroll = true, edges = ["left", "right"], contentStyle }: ScreenProps) => {
  const t = useTheme();
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.screen} edges={edges}>
      <StatusBar style={t.scheme === "dark" ? "light" : "dark"} />
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
};
