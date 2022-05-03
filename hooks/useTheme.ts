import { TextStyle, ViewStyle } from "react-native";
import useStore from "./useStore";

/**
 * For mobx observable components
 * @returns ITheme
 */
export default function useTheme(): ITheme {
  const { settings } = useStore();
  return Theme.dark;
  return settings.theme === "dark" ? Theme.dark : Theme.light;
}

interface ITheme {
  gradient_colors: string[];
  gradient_style: {
    backgroundColor: string;
  };
  text: {
    primary: TextStyle;
    secondary: TextStyle;
    colorText: TextStyle;
    inputPlaceholder: string;
  };
  bottomsheet: {
    background: Omit<
      ViewStyle,
      "left" | "right" | "top" | "bottom" | "position"
    >;
    indicator: ViewStyle;
  };
}

const Theme = {
  dark: {
    gradient_colors: ["#EF015A33", "#EF015A00"],
    gradient_style: {
      backgroundColor: "#4863E8",
    },
    text: {
      primary: {
        color: "#FFFFFF",
      },
      secondary: {
        color: "#FFFFFF",
        opacity: 0.5,
      },
      colorText: {
        color: "#4C61E5",
      },
      inputPlaceholder: "#5b5b6d", // from colorPiker for remove opacity
    },
    bottomsheet: {
      background: {
        backgroundColor: "#2b2b47",
      },
      indicator: {
        backgroundColor: "#404059",
      },
    },
  } as ITheme,
  light: {} as ITheme,
};
