"use client";
import React, { useState, useCallback, useMemo } from "react";
import {
  ThemeProvider,
  createGlobalStyle,
  DefaultTheme,
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

// Extend DefaultTheme to include custom properties
declare module "styled-components" {
  export interface DefaultTheme {
    mode: "light" | "dark";
    toggleTheme: () => void;
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
 button {
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.buttonText.default};
  border: none;
  padding: 0.625rem 1.25rem;
  gap: 0.5rem;
  border-radius: 5px;
  transition: all 0.3s ease;
    &:hover {
      background-color: ${(props) => props.theme.colors.primary};
      color: ${(props) => props.theme.colors.buttonText.hover};
    }
    &:active {
      background-color: ${(props) => props.theme.colors.secondary};
      color: ${(props) => props.theme.colors.buttonText.active};
    }
  }
  label{
    margin-bottom: 0.5rem;
    font-weight: bold;
    font-size: 0.875rem; // 14px 
  }
  input{
    border: 1px solid #3a3a3a;
    display: flex;
    flex-direction: row;
    border-radius: 0.5rem;
    padding: 0.75rem;
    &::placeholder {
      color: #888;
    }
    &:focus {
    border: 1px solid #3a3a3a;
    }
  }
}
`;

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
      colors: {
        buttonText: buttonTextColor,
        text: textColor,
        background: backgroundColor,
        primary: primaryColor,
        secondary: secondaryColor,
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
