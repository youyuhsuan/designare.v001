import { DefaultTheme } from "styled-components";

const lightColors = {
  background: "rgb(248, 248, 248)",
  text: "rgb(38, 37, 36)",
  primary: "rgb(130, 130, 130)",
  primarySubtle: "rgba(130, 130, 130, 0.1)",
  primaryBorder: "rgba(130, 130, 130, 0.3)",
  primaryText: "rgb(100, 100, 100)",
  secondary: "rgb(233, 233, 233)",
  secondarySubtle: "rgba(233, 233, 233, 0.1)",
  secondaryBorder: "rgba(233, 233, 233, 0.3)",
  secondaryText: "rgb(180, 180, 180)",
  tertiary: "rgb(24, 24, 24)",
  tertiarySubtle: "rgba(24, 24, 24, 0.1)",
  tertiaryBorder: "rgba(24, 24, 24, 0.3)",
  tertiaryText: "rgb(10, 10, 10)",

  accent: "rgb(234, 60, 77)",
  accentSubtle: "rgba(234, 60, 77, 0.1)",
  accentBorder: "rgba(234, 60, 77, 0.3)",
  accentText: "rgb(200, 30, 50)",

  info: "rgb(66, 134, 244)",
  infoSubtle: "rgba(66, 134, 244, 0.1)",
  infoBorder: "rgba(66, 134, 244, 0.3)",
  infoText: "rgb(50, 100, 200)",

  success: "rgb(40, 167, 69)",
  danger: "rgb(220, 53, 69)",
  warning: "rgb(255, 193, 7)",

  border: "rgb(200, 200, 200)",
  shadow: "rgba(0, 0, 0, 0.1)",
  canvas: "rgb(248, 248, 248)",
  canvasBackgound: "rgb(245, 245, 245)",
};

const darkColors = {
  background: "rgb(38, 37, 36)",
  text: "rgb(38, 37, 36)",
  primary: "rgb(28, 28, 28)",
  primarySubtle: "rgba(28, 28, 28, 0.1)",
  primaryBorder: "rgba(28, 28, 28, 0.3)",
  primaryText: "rgb(200, 200, 200)",

  secondary: "rgb(67, 67, 67)",
  secondarySubtle: "rgba(67, 67, 67, 0.1)",
  secondaryBorder: "rgba(67, 67, 67, 0.3)",
  secondaryText: "rgb(180, 180, 180)",

  tertiary: "rgb(258, 250, 238)",
  tertiarySubtle: "rgba(258, 250, 238, 0.1)",
  tertiaryText: "rgb(240, 230, 220)",

  accent: "rgb(233, 254, 163)",
  accentSubtle: "rgba(233, 254, 163, 0.1)",
  accentBorder: "rgba(233, 254, 163, 0.3)",
  accentText: "rgb(200, 230, 100)",

  success: "rgb(40, 167, 69)",
  danger: "rgb(220, 53, 69)",
  warning: "rgb(255, 193, 7)",
  info: "rgb(200, 200, 200)",

  border: "rgb(50, 50, 50)",
  shadow: "rgba(0, 0, 0, 0.7)",
  canvas: "rgb(248, 248, 248)",
  canvasBackground: "rgb(245, 245, 245)",
};

const createTheme = (mode: "light" | "dark"): DefaultTheme => ({
  mode,
  colors: mode === "light" ? lightColors : darkColors,
  button: {
    primary: mode === "light" ? "rgb(247, 241, 237)" : "rgb(247, 241, 237)",
    secondary: mode === "light" ? "rgb(247, 241, 237)" : "rgb(38, 37, 36)",
    danger: mode === "light" ? "rgb(247, 241, 237)" : "rgb(247, 241, 237)",
    accent: mode === "light" ? "rgb(247, 241, 237)" : "rgb(247, 241, 237)",
    backgroundColor: {
      primary: mode === "light" ? "rgb(80, 80, 80)" : "rgb(140, 140, 140)",
      secondary: mode === "light" ? "rgb(240, 240, 240)" : "rgb(70, 70, 70)",
      danger: mode === "light" ? "#ff4d4f" : "#d9363e",
      accent: mode === "light" ? "rgb(234, 60, 77)" : "rgb(233, 254, 163)",
    },
  },
  inputs: {
    wrapper: `
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      margin-bottom: 1rem; // 16px
    `,
    input: `
      padding: 0.75rem;
      border: 1px solid ${
        mode === "light" ? lightColors.border : darkColors.border
      };
      font-size: 1rem;
      &::placeholder {
        color:${mode === "light" ? lightColors.info : darkColors.info};
      }
      &:focus {
        border-color: ${
          mode === "light" ? lightColors.border : darkColors.border
        };
        box-shadow: 0 0 0 2px ${
          mode === "light"
            ? lightColors.border + "33"
            : darkColors.border + "33"
        };
        outline: none;
      }
    `,
    label: `
      margin-bottom: 0.4rem;
      font-weight: bold;
      font-size: 0.875rem;
    `,
    error: `
      color: ${mode === "light" ? "rgb(203,64,66)" : "rgb(171,59,58)"};
      font-size: 0.8rem;
      margin-top: 0.25rem;
    `,
  },
  borderRadius: {
    xs: "0.125rem", // 2px
    sm: "0.25rem", // 4px
    md: "0.375rem", // 6px
    xl: "0.75rem", // 12px
    xxl: "1rem", // 14px
    xxxl: "1.5rem", // 16px
  },
  transition: "all 0.3s ease",
  transform: "none",
});

export default createTheme;
