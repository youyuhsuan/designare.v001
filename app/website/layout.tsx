"use client";

import React, { useState } from "react";
import styled from "styled-components";
import WebsiteBuilderNavbar from "@/src/Components/WebsiteBuilder/WebsiteBuilderNavbar";
import { ElementProvider } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import { Toolbar } from "@/src/Components/WebsiteBuilder/Toolbar/Toolbar";
import SidebarEditor from "@/src/Components/WebsiteBuilder/SidebarEditor/SidebarEditor";

const BuilderContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  width: 100dvw;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ToolbarWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  border-right: 1px solid ${(props) => props.theme.colors.border};
  overflow-y: auto;
`;

const MainContentWrapper = styled.div`
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

export default function WebsiteBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ElementProvider>
      <BuilderContainer>
        <WebsiteBuilderNavbar />
        <ContentContainer>
          <ToolbarWrapper>
            <Toolbar />
          </ToolbarWrapper>
          <MainContentWrapper>{children}</MainContentWrapper>
          <EditorWrapper>
            <SidebarEditor />
          </EditorWrapper>
        </ContentContainer>
      </BuilderContainer>
    </ElementProvider>
  );
}
