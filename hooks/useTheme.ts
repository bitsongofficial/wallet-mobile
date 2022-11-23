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
    autocomplete: TextStyle;
  };
  bottomsheet: {
    background: Omit<
      ViewStyle,
      "left" | "right" | "top" | "bottom" | "position"
    >;
    indicator: ViewStyle;
  };
  appBackground: ViewStyle;
  jsonTheme: {
    base00: string,
    base01: string,
    base02: string,
    base03: string,
    base04: string,
    base05: string,
    base06: string,
    base07: string,
    base08: string,
    base09: string,
    base0A: string,
    base0B: string,
    base0C: string,
    base0D: string,
    base0E: string,
    base0F: string
  },
}

const Theme = {
  dark: {
    gradient_colors: ["#EF015A33", "#EF015A00"],
    gradient_style: {
      backgroundColor: COLOR.RoyalBlue,
    },
    text: {
      primary: {
        color: COLOR.White,
      },
      secondary: {
        color: COLOR.White,
        opacity: 0.5,
      },
      secondary2: {
        // TODO: need alfa color or flat color
        color: COLOR.White,
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
      autocomplete: {
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
    appBackground: {
      backgroundColor: COLOR.Dark3,
    },
    jsonTheme: {
      base00: COLOR.Dark2,
      base01: '#383830',
      base02: '#49483e',
      base03: '#75715e',
      base04: '#a59f85',
      base05: '#f8f8f2',
      base06: '#f5f4f1',
      base07: '#f9f8f5',
      base08: '#f92672',
      base09: '#fd971f',
      base0A: '#f4bf75',
      base0B: '#a6e22e',
      base0C: '#a1efe4',
      base0D: '#66d9ef',
      base0E: '#ae81ff',
      base0F: '#cc6633'
    },
  } as ITheme,
  light: {} as ITheme,
};
