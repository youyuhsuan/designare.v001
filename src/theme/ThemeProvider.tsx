"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
  DefaultTheme,
} from "styled-components";
import { normalize } from "styled-normalize";
import { lightTheme, darkTheme } from "@/src/theme/Theme";

interface ThemeContextType {
  theme: DefaultTheme;
  toggleTheme: () => void;
}

const GlobalStyle = createGlobalStyle`
  ${normalize}
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: color 0.3s, background-color 0.3s;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
  }
  
  a {
    text-decoration: none;
    transition: color 0.3s;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

//
const getInitialMode = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    const savedMode = localStorage.getItem("themeMode") as
      | "light"
      | "dark"
      | null;
    if (savedMode) {
      return savedMode;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light"; // Default for server-side rendering
};

const applyTheme = (mode: "light" | "dark") => {
  if (typeof document !== "undefined") {
    document.body.setAttribute("data-theme", mode);
    document.documentElement.style.setProperty("color-scheme", mode);
  }
};

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<"light" | "dark">("light"); // 默认为 light

  useEffect(() => {
    const initialMode = getInitialMode();
    setMode(initialMode);
    console.log("Initial mode:", initialMode);
  }, []);

  useEffect(() => {
    console.log("Current mode:", mode);
    localStorage.setItem("themeMode", mode);
    applyTheme(mode);
  }, [mode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newMode = e.matches ? "dark" : "light";
      setMode(newMode);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  const theme = mode === "light" ? lightTheme : darkTheme;

  const contextValue = useMemo<ThemeContextType>(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <StyledThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeWrapper");
  }
  return context;
};
