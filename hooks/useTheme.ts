import { TextStyle, ViewStyle } from "react-native";
import { COLOR, hexAlpha } from "utils";
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
    secondary2: TextStyle;
    colorText: TextStyle;
  };
  input: {
    container: ViewStyle;
    placeholder: string;
    component: TextStyle;
    autocomplite: TextStyle;
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
      secondary2: {
        // TODO: need alfa color or flat color
        color: "#FFFFFF",
        opacity: 0.3,
      },

      colorText: {
        color: "#4C61E5",
      },
    },
    input: {
      container: {
        backgroundColor: COLOR.Dark2,
      },
      component: {
        color: COLOR.White,
      },
      placeholder: COLOR.Marengo,
      autocomplite: {
        color: hexAlpha(COLOR.White, 20),
      },
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
