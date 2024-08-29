"use client";

import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { SiteContainerProps } from "./BuilderInterface";

const Container = styled.div`
  width: 100%;
  min-height: 100dvh;
  height: 100%;
  background-color: ${(props) => props.theme.colors.background};
  margin: 0 auto;
  box-shadow: 0 0 10px ${(props) => props.theme.colors.shadow};
  overflow: auto;
  position: relative; // Ensure positioning context for absolute children
`;

export const SiteContainer: React.FC<SiteContainerProps> = ({
  children,
  width,
  height,
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.id = "viewport";
    }
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // 確保點擊事件來自容器本身，而不是其子元素
    if (event.target === event.currentTarget) {
      onClick?.(event);
    }
  };

  return (
    <Container
      ref={containerRef}
      style={{ width: width, height: height }}
      onClick={handleClick}
      data-element-id="viewport"
    >
      {children}
    </Container>
  );
};
