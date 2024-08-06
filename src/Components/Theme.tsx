"use client";

import normalize from "styled-normalize";
import React, { useState, useCallback, useMemo, forwardRef } from "react";

import {
  ThemeProvider,
  createGlobalStyle,
  DefaultTheme,
  styled,
  css,
} from "styled-components";
import theme, { ThemeSet } from "styled-theming";

// Define colors for different themes
export const backgroundColor = theme("mode", {
  light: "rgb(248, 248, 248)",
  dark: "rgb(38, 37, 36)",
});

export const textColor = theme("mode", {
  light: "rgb(38, 37, 36)",
  dark: "rgb(248, 248, 248)",
});

export const primaryColor = theme("mode", {
  light: "rgb(130, 130, 130)",
  dark: "rgb(28, 28, 28)",
});

export const secondaryColor = theme("mode", {
  light: "rgb(233, 233, 233)",
  dark: "rgb(67, 67, 67)",
});

export const tertiaryColor = theme("mode", {
  light: "rgb(24, 24, 24)",
  dark: "rgb(258, 250, 238)",
});

export const accentColor = theme("mode", {
  light: "rgb(234, 60, 77)",
  dark: "rgb(233, 254, 163)",
});

export const borderColor = theme("mode", {
  light: "rgb(200, 200, 200)",
  dark: "rgb(50, 50, 50)",
});

export const shadowColor = theme("mode", {
  light: "rgba(0, 0, 0, 0.1)",
  dark: "rgba(0, 0, 0, 0.7)",
});

export const buttonTextColor = {
  default: theme("mode", {
    light: "rgb(38, 37, 36)",
    dark: "rgb(247, 241, 237)",
  }),
  hover: theme("mode", {
    light: "rgba(38, 37, 36,0.2)",
    dark: "rgba(38, 37, 36,0.8)",
  }),
  active: theme("mode", {
    light: "rgb(38, 37, 36)",
    dark: "rgb(247, 241, 237)",
  }),
};

export const button = {
  primary: theme("mode", {
    light: "rgb(247, 241, 237)",
    dark: "rgb(247, 241, 237)",
  }),
  secondary: theme("mode", {
    light: "rgb(247, 241, 237)",
    dark: "rgb(38, 37, 36)",
  }),
  danger: theme("mode", {
    light: "rgb(247, 241, 237)",
    dark: "rgb(247, 241, 237)",
  }),
  accent: theme("mode", {
    light: "rgb(247, 241, 237)",
    dark: "rgb(247, 241, 237)",
  }),
};

export const buttonBackgroundColors = {
  primary: theme("mode", {
    light: "rgb(80, 80, 80)",
    dark: "rgb(140, 140, 140)",
  }),
  secondary: theme("mode", {
    light: "rgb(240, 240, 240)",
    dark: "rgb(70, 70, 70)",
  }),
  danger: theme("mode", {
    light: "#ff4d4f",
    dark: "#d9363e",
  }),
  accent: theme("mode", {
    light: "rgb(234, 60, 77)",
    dark: "rgb(233, 254, 163)",
  }),
};

// Extend DefaultTheme to include custom properties
declare module "styled-components" {
  export interface DefaultTheme {
    mode: "light" | "dark";
    toggleTheme: () => void;
    button: {
      primary: ThemeSet;
      secondary: ThemeSet;
      danger: ThemeSet;
      accent: ThemeSet;
      backgroundColor: {
        primary: ThemeSet;
        secondary: ThemeSet;
        danger: ThemeSet;
        accent: ThemeSet;
      };
    };
    colors: {
      text: ThemeSet;
      buttonText: {
        default: ThemeSet;
        hover: ThemeSet;
        active: ThemeSet;
      };
      background: ThemeSet;
      primary: ThemeSet;
      secondary: ThemeSet;
      tertiary: ThemeSet;
      accent: ThemeSet;
      border: ThemeSet;
      shadow: ThemeSet;
    };
    inputs: {
      wrapper: string;
      input: string;
      label: string;
      error: string;
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

const GlobalStyle = createGlobalStyle`
  ${normalize}
  body {
    color: ${(props) => props.theme.colors.text};
    background-color: ${(props) => props.theme.colors.background};
    font-family: Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    transition: color 0.3s, background-color 0.3s;
  }
  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.3s;
  }
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: "primary" | "secondary" | "danger" | "accent";
}

const buttonStyles = css<ButtonProps>`
  display: flex;
  align-items: center;
  width: 100%;
  border: none;
  border-radius: 5px;
  padding: 0.625rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 8px;
  ${(props) => {
    const variant = props.$variant || "primary";
    return css`
      background-color: ${props.theme.button.backgroundColor[variant]};
      color: ${props.theme.button[variant]};
      &:hover {
        opacity: 0.8;
      }

      &:active {
        opacity: 0.6;
      }
    `;
  }};
`;

const StyledButton = styled.button<ButtonProps>`
  ${buttonStyles}
`;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { children, $variant = "primary", ...rest } = props;
    return (
      <StyledButton $variant={$variant} {...rest} ref={ref}>
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = "Button";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  // Memoize the theme object to prevent unnecessary re-renders
  const themeObject: DefaultTheme = useMemo(
    () => ({
      mode,
      toggleTheme,
      button: {
        primary: button.primary,
        secondary: button.secondary,
        danger: button.danger,
        accent: button.accent,
        backgroundColor: buttonBackgroundColors,
      },
      colors: {
        buttonText: buttonTextColor,
        text: textColor,
        background: backgroundColor,
        primary: primaryColor,
        secondary: secondaryColor,
        tertiary: tertiaryColor,
        accent: accentColor,
        border: borderColor,
        shadow: shadowColor,
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
          border: 1px solid ${border};
          border-radius: 0.5rem;
          font-size: 1rem;
          &::placeholder {
            color: #888;
          }
          &:focus {
            border-color: ${primaryColor};
            box-shadow: 0 0 0 2px ${primaryColor}33;
            outline: none;
          }
        `,
        label: `
          margin-bottom: 0.4rem;
          font-weight: bold;
          font-size: 0.875rem;
        `,
        error: `
          color: ${theme("mode", {
            light: "rgb(203,64,66)",
            dark: "rgb(171,59,58)",
          })};
          font-size: 0.8rem;
          margin-top: 0.25rem;
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
    }),
    [mode, toggleTheme]
  );

  return (
    <ThemeProvider theme={themeObject}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
