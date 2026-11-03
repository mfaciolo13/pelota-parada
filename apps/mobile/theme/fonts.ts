import {
  BarlowCondensed_700Bold,
  BarlowCondensed_800ExtraBold,
} from "@expo-google-fonts/barlow-condensed";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

import { fontFamily } from "./tokens";

export const fonts = {
  [fontFamily.displayBold]: BarlowCondensed_700Bold,
  [fontFamily.displayExtraBold]: BarlowCondensed_800ExtraBold,
  [fontFamily.textRegular]: Inter_400Regular,
  [fontFamily.textBold]: Inter_700Bold,
};

export const useThemeFonts = () => {
  return useFonts(fonts);
};
