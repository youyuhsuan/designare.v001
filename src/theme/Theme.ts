import { DefaultTheme } from "styled-components";

const lightColors = {
  background: "rgb(248, 248, 248)",
  text: "rgb(38, 37, 36)",
  primary: "rgb(130, 130, 130)",
  secondary: "rgb(233, 233, 233)",
  tertiary: "rgb(24, 24, 24)",
  accent: "rgb(234, 60, 77)",
  border: "rgb(200, 200, 200)",
  shadow: "rgba(0, 0, 0, 0.1)",
};

const darkColors = {
  background: "rgb(38, 37, 36)",
  text: "rgb(248, 248, 248)",
  primary: "rgb(28, 28, 28)",
  secondary: "rgb(67, 67, 67)",
  tertiary: "rgb(258, 250, 238)",
  accent: "rgb(233, 254, 163)",
  border: "rgb(50, 50, 50)",
  shadow: "rgba(0, 0, 0, 0.7)",
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
      margin-bottom: 1rem;
    `,
    input: `
      padding: 0.75rem;
      border: 1px solid ${
        mode === "light" ? lightColors.border : darkColors.border
      };
      font-size: 1rem;
      &::placeholder {
        color: #888;
      }
      &:focus {
        border-color: ${
          mode === "light" ? lightColors.primary : darkColors.primary
        };
        box-shadow: 0 0 0 2px ${
          mode === "light"
            ? lightColors.primary + "33"
            : darkColors.primary + "33"
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
