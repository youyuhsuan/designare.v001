export const colors = {
  light: {
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
    canvasBackground: "rgb(245, 245, 245)",
  },
  dark: {
    background: "rgb(38, 37, 36)",
    text: "rgb(248, 248, 248)",
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
    tertiaryBorder: "rgba(258, 250, 238, 0.3)", // Added
    tertiaryText: "rgb(240, 230, 220)",
    accent: "rgb(233, 254, 163)",
    accentSubtle: "rgba(233, 254, 163, 0.1)",
    accentBorder: "rgba(233, 254, 163, 0.3)",
    accentText: "rgb(200, 230, 100)",
    info: "rgb(200, 200, 200)",
    infoSubtle: "rgba(200, 200, 200, 0.1)", // Added
    infoBorder: "rgba(200, 200, 200, 0.3)", // Added
    infoText: "rgb(180, 180, 180)", // Added
    success: "rgb(40, 167, 69)",
    danger: "rgb(220, 53, 69)",
    warning: "rgb(255, 193, 7)",
    border: "rgb(50, 50, 50)",
    shadow: "rgba(0, 0, 0, 0.7)",
    canvas: "rgb(248, 248, 248)",
    canvasBackground: "rgb(245, 245, 245)",
  },
};

export type ThemeColors = typeof colors.light;
