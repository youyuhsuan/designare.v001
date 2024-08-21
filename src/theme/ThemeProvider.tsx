"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  ThemeProvider as StyledThemeProvider,
  createGlobalStyle,
  DefaultTheme,
} from "styled-components";
import { normalize } from "styled-normalize";
import createTheme from "@/src/theme/Theme";

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
  }
  
  a {
    text-decoration: none;
    transition: color 0.3s;
  }
`;

export const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

const getInitialMode = (): "light" | "dark" => {
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
};

const applyTheme = (mode: "light" | "dark") => {
  document.body.setAttribute("data-theme", mode);
  document.documentElement.style.setProperty("color-scheme", mode);
};

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<"light" | "dark">(getInitialMode);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const newMode = e.matches ? "dark" : "light";
      setMode(newMode);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("themeMode", mode);
    applyTheme(mode);
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  const theme = useMemo(() => createTheme(mode), [mode]);

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
