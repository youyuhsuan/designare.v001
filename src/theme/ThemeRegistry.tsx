"use client";

import React, { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { ThemeWrapper } from "@/src/theme/ThemeProvider";

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== "undefined") {
    return <ThemeWrapper>{children}</ThemeWrapper>;
  }

  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      <ThemeWrapper>{children}</ThemeWrapper>
    </StyleSheetManager>
  );
}
