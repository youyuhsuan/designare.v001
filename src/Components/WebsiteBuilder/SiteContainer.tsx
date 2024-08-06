import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff; // 使用白色背景，更接近實際網站
  margin: 0 auto; // 居中
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); // 添加陰影以區分畫布和背景
  overflow: auto; // 允許滾動
`;

interface SiteContainerProps {
  children: React.ReactNode;
  width?: string; // 允許設置網站寬度
}

export const SiteContainer: React.FC<SiteContainerProps> = ({
  children,
  width = "1200px",
}) => <Container style={{ maxWidth: width }}>{children}</Container>;
