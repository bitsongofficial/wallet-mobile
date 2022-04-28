import { TextStyle } from "react-native";
import useStore from "./useStore";

/**
 * For mobx observable components
 * @returns ITheme
 */
export default function useTheme(): ITheme {
  const { settings } = useStore();

  const theme = settings.theme;

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
    },
  } as ITheme,
  light: {} as ITheme,
};
