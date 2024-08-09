// 實現網站容器，接受全局設置作為 props
"use client";

import React, { ReactNode } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  min-height: 100dvh;
  background-color: ${(props) => props.theme.colors.background};
  margin: 0 auto;
  box-shadow: 0 0 10px ${(props) => props.theme.colors.shadow};
  overflow: auto;
  position: relative; // Ensure positioning context for absolute children
`;

interface SiteContainerProps {
  width?: string;
  children: ReactNode;
}

export const SiteContainer: React.FC<SiteContainerProps> = ({
  children,
  width = "1200px",
}) => <Container style={{ maxWidth: width }}>{children}</Container>;
