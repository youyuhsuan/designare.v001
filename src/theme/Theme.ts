import { DefaultTheme } from "styled-components";
import { colors, ThemeColors } from "./colors";

const createTheme = (mode: "light" | "dark"): DefaultTheme => {
  const themeColors: ThemeColors = colors[mode];

  return {
    mode,
    colors: themeColors,
    button: {
      text: {
        primary: themeColors.primaryText,
        secondary: themeColors.secondaryText,
        tertiary: themeColors.tertiaryText,
        accent: themeColors.accentText,
        danger: themeColors.danger,
        success: themeColors.success,
        warning: themeColors.warning,
        info: themeColors.info,
      },
      background: {
        primary: themeColors.primary,
        secondary: themeColors.secondary,
        tertiary: themeColors.tertiary,
        accent: themeColors.accent,
        danger: themeColors.danger,
        success: themeColors.success,
        warning: themeColors.warning,
        info: themeColors.info,
      },
      hover: {
        primary: themeColors.primarySubtle,
        secondary: themeColors.secondarySubtle,
        tertiary: themeColors.tertiarySubtle,
        accent: themeColors.accentSubtle,
        danger: `${themeColors.danger}CC`,
        success: `${themeColors.success}CC`,
        warning: `${themeColors.warning}CC`,
        info: `${themeColors.info}CC`,
      },
      outlined: {
        primary: themeColors.primaryBorder,
        secondary: themeColors.secondaryBorder,
        tertiary: themeColors.tertiary,
        accent: themeColors.accentBorder,
        danger: themeColors.danger,
        success: themeColors.success,
        warning: themeColors.warning,
        info: themeColors.info,
      },
    },
    inputs: {
      wrapper: `
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-bottom: 1rem;
      `,
      input: `
        padding: 0.75rem;
        border: 1px solid ${themeColors.border};
        font-size: 1rem;
        &::placeholder {
          color: ${themeColors.info};
        }
        &:focus {
          border-color: ${themeColors.border};
          box-shadow: 0 0 0 2px ${themeColors.border}33;
          outline: none;
        }
      `,
      label: `
        margin-bottom: 0.4rem;
        font-weight: bold;
        font-size: 0.875rem;
      `,
    },
    borderRadius: {
      xs: "0.125rem",
      sm: "0.25rem",
      md: "0.375rem",
      xl: "0.75rem",
      xxl: "1rem",
      xxxl: "1.5rem",
    },
    transition: "all 0.3s ease",
    transform: "none",
  };
};

export const lightTheme = createTheme("light");
export const darkTheme = createTheme("dark");

export default createTheme;
