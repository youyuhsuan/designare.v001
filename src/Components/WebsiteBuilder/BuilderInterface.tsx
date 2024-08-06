import React from "react";
import styled from "styled-components";
import { WebsiteBuilder } from "./WebsiteBuilder";

const BuilderWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #f0f0f0;
  padding: 20px;
`;

const CanvasArea = styled.div`
  flex: 1;
  background-color: #e0e0e0;
  padding: 20px;
  overflow: auto;
`;

export const BuilderInterface: React.FC = () => (
  <BuilderWrapper>
    <Sidebar>{/* 這裡可以添加工具欄、元素庫等 */}</Sidebar>
    <CanvasArea>
      <WebsiteBuilder />
    </CanvasArea>
  </BuilderWrapper>
);
