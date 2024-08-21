"use client";

import React from "react";
import styled from "styled-components";

import { ElementProvider } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import { CanvasArea } from "@/src/Components/WebsiteBuilder/CanvasArea";
import { Toolbar } from "@/src/Components/WebsiteBuilder/Toolbar/Toolbar";
import Navbar from "@/src/Components/WebsiteBuilder/Navbar";

import SidebarEditor from "@/src/Components/WebsiteBuilder/SidebarEditor/SidebarEditor";
import { NextUIProvider } from "@nextui-org/react";

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
  background-color: ${(props) => props.theme.colors.background};
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
`;

const CanvasWrapper = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
`;

const EditorWrapper = styled.div`
  width: 300px;
  background-color: ${(props) => props.theme.colors.background};
  border-left: 1px solid ${(props) => props.theme.colors.border};
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
            <Toolbar />
          </ToolbarWrapper>
          <CanvasWrapper>
            <CanvasArea />
          </CanvasWrapper>
          <SidebarEditor />
        </ContentContainer>
      </BuilderContainer>
    </NextUIProvider>
  </ElementProvider>
);

export default WebsiteBuilder;
