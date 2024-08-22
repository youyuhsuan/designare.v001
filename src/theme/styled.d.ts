import "styled-components";
import { ThemeColors } from "./colors";

declare module "styled-components" {
  export interface DefaultTheme {
    mode: "light" | "dark";
    colors: ThemeColors;
    button: {
      text: {
        primary: string;
        secondary: string;
        tertiary: string;
        accent: string;
        danger: string;
        success: string;
        warning: string;
        info: string;
      };
      background: {
        primary: string;
        secondary: string;
        tertiary: string;
        accent: string;
        danger: string;
        success: string;
        warning: string;
        info: string;
      };
      hover: {
        primary: string;
        secondary: string;
        tertiary: string;
        accent: string;
        danger: string;
        success: string;
        warning: string;
        info: string;
      };
      outlined: {
        primary: string;
        secondary: string;
        tertiary: string;
        accent: string;
        danger: string;
        success: string;
        warning: string;
        info: string;
      };
    };
    inputs: {
      wrapper: string;
      input: string;
      label: string;
    };
    borderRadius: {
      xs: string;
      sm: string;
      md: string;
      xl: string;
      xxl: string;
      xxxl: string;
    };
    transition: string;
    transform: string;
  }
}
