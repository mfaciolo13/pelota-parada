import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { StyleSheet, useColorScheme, type ImageStyle, type TextStyle, type ViewStyle } from "react-native";

import { themes, type Theme } from "./theme";
import type { Scheme } from "./tokens";

const ThemeContext = createContext<Theme>(themes.light);

type Props = {
  children: ReactNode;
  scheme?: Scheme;
};

export const ThemeProvider = ({ children, scheme }: Props) => {
  const system = useColorScheme();
  const hydrated = useHydrated();
  // En web el servidor renderiza claro; el cliente arranca igual para que la hidratacion coincida.
  const theme = themes[scheme ?? (hydrated && system === "dark" ? "dark" : "light")];
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

const noop = () => () => {};
const useHydrated = () => {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
};

export const useTheme = (): Theme => {
  return useContext(ThemeContext);
};

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle };

export const makeStyles = <T extends NamedStyles<T>>(
  create: (theme: Theme) => T & NamedStyles<Record<string, unknown>>,
) => {
  const cache = new Map<Scheme, T>();
  const useStyles = (): T => {
    const theme = useTheme();
    return useMemo(() => {
      const cached = cache.get(theme.scheme);
      if (cached) return cached;
      const styles = StyleSheet.create(create(theme));
      cache.set(theme.scheme, styles);
      return styles;
    }, [theme]);
  };
  return useStyles;
};
