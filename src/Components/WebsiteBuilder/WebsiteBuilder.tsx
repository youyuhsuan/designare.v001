"use client";

import React from "react";
import styled from "styled-components";
import { ElementProvider } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import { CanvasArea } from "@/src/Components/WebsiteBuilder/CanvasArea";
import { Sidebar } from "@/src/Components/WebsiteBuilder/Sidebar/Sidebar";

const BuilderContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidebarWrapper = styled.div`
  width: 300px;
  height: 100%;
  overflow-y: auto;
  background-color: #f0f0f0;
  border-right: 1px solid #ddd;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }
`;

const CanvasWrapper = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  background-color: #fff;
`;

export const WebsiteBuilder: React.FC = () => (
  <ElementProvider>
    <BuilderContainer>
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>
      <CanvasWrapper>
        <CanvasArea />
      </CanvasWrapper>
    </BuilderContainer>
  </ElementProvider>
);

export default WebsiteBuilder;
