"use client";

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
  light: "rgb(214, 219, 220)",
  dark: "rgb(0, 0, 0)",
});

export const textColor = theme("mode", {
  light: "rgb(0, 0, 0)",
  dark: "rgb(255, 255, 255)",
});

export const primaryColor = theme("mode", {
  light: "#0070f3",
  dark: "#00a0ff",
});

export const secondaryColor = theme("mode", {
  light: "#f4e5aa",
  dark: "#ffd700",
});

export const buttonTextColor = {
  default: theme("mode", {
    light: "#ffffff",
    dark: "#ffffff",
  }),
  hover: theme("mode", {
    light: "#ffffff",
    dark: "#000000",
  }),
  active: theme("mode", {
    light: "#ffffff",
    dark: "#ffffff",
  }),
};

export const button = {
  primary: theme("mode", {
    light: "#ffffff",
    dark: "#ffffff",
  }),
  secondary: theme("mode", {
    light: "#ffffff",
    dark: "#000000",
  }),
  danger: theme("mode", {
    light: "#ffffff",
    dark: "#ffffff",
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
      backgroundColor: {
        primary: ThemeSet;
        secondary: ThemeSet;
        danger: ThemeSet;
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
    };
    inputs: {
      wrapper: string;
      input: string;
      label: string;
      error: string;
    };
  }
}

const GlobalStyle = createGlobalStyle`
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
  $variant?: "primary" | "secondary" | "danger";
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
        backgroundColor: {
          primary: theme("mode", {
            light: "#0070f3",
            dark: "#00a0ff",
          }),
          secondary: theme("mode", {
            light: "#f4f4f4",
            dark: "#333333",
          }),
          danger: theme("mode", {
            light: "#ff4d4f",
            dark: "#d9363e",
          }),
        },
      },
      colors: {
        buttonText: buttonTextColor,
        text: textColor,
        background: backgroundColor,
        primary: primaryColor,
        secondary: secondaryColor,
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
          border: 1px solid #3a3a3a;
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
            light: "#ff4d4f",
            dark: "#ff7875",
          })};
          font-size: 0.8rem;
          margin-top: 0.25rem;
         `,
      },
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
