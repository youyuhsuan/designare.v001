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

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<"light" | "dark">(() => {
    // 初始化時檢查系統偏好
    // if (typeof window !== "undefined") {
    //   return window.matchMedia("(prefers-color-scheme: dark)").matches
    //     ? "dark"
    //     : "light";
    // }
    return "light"; // 默認為亮色主題
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setMode(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  const theme = useMemo(() => createTheme(mode), [mode]);

  const contextValue = useMemo(
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
