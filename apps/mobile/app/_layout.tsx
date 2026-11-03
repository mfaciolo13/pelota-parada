import { DarkTheme, DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo } from "react";

import { ThemeProvider, useTheme, useThemeFonts } from "@/theme";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, fontsError] = useThemeFonts();

  useEffect(() => {
    if (fontsLoaded || fontsError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontsError]);

  if (!fontsLoaded && !fontsError) return null;

  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
};

const Navigation = () => {
  const t = useTheme();

  const navigationTheme = useMemo(() => {
    const base = t.scheme === "dark" ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: t.colors.green,
        background: t.colors.bg,
        card: t.colors.bg,
        text: t.colors.ink,
        border: t.colors.line,
        notification: t.colors.cardRed,
      },
    };
  }, [t]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false, headerTitleStyle: t.typography.title }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </NavigationThemeProvider>
  );
};

export default RootLayout;
