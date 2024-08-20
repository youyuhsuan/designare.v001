"use client";

import React from "react";
import styled from "styled-components";
import { ElementProvider } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import { CanvasArea } from "@/src/Components/WebsiteBuilder/CanvasArea";
import { Sidebar } from "@/src/Components/WebsiteBuilder/Sidebar/Sidebar";
import Navbar from "@/src/Components/WebsiteBuilder/Navbar";
import SidebarEditor from "@/src/Components/WebsiteBuilder/SidebarEditor/SidebarEditor";
import { NextUIProvider } from "@nextui-org/react";
import { useElementSelection } from "@/src/Hooks/useElementSelection";

const BuilderContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ToolbarWrapper = styled.div`
  width: 240px;
  background-color: #f0f0f0;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
`;

const CanvasWrapper = styled.div`
  flex: 1;
  background-color: #ffffff;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
`;

const EditorWrapper = styled.div`
  width: 300px;
  background-color: #f8f8f8;
  border-left: 1px solid #e0e0e0;
  overflow-y: auto;
  padding: 16px;
`;

export const WebsiteBuilder: React.FC = () => (
  <ElementProvider>
    <NextUIProvider>
      <BuilderContainer>
        <Navbar />
        <ContentContainer>
          <ToolbarWrapper>
            <Sidebar />
          </ToolbarWrapper>
          <CanvasWrapper>
            <CanvasArea />
          </CanvasWrapper>
          <EditorWrapper>
            <SidebarEditor />
          </EditorWrapper>
        </ContentContainer>
      </BuilderContainer>
    </NextUIProvider>
  </ElementProvider>
);

export default WebsiteBuilder;
