"use client";

import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import WebsiteBuilderNavbar from "@/src/Components/WebsiteBuilder/WebsiteBuilderNavbar";
import { ElementProvider } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import Toolbar from "@/src/Components/WebsiteBuilder/Toolbar/Toolbar";
import SidebarEditor from "@/src/Components/WebsiteBuilder/SidebarEditor/SidebarEditor";
import { useAppDispatch, useAppSelector } from "@/src/libs/hook";
import { undo, redo } from "@/src/libs/features/websiteBuilder/historySlice";
import {
  createNewWebsite,
  fetchWebsiteMetadata,
} from "@/src/libs/features/websiteBuilder/websiteMetadataThunk";
import { selectWebsiteMetadata } from "@/src/libs/features/websiteBuilder/websiteMetadataSelector";
import { useParams } from "next/navigation";

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
  const websiteMetadata = useAppSelector(selectWebsiteMetadata);
  const dispatch = useAppDispatch();
  const params = useParams(); // 路由參數
  const id = params.id as string;

  // const handlePreview = useCallback(() => {
  //   dispatch(preview());
  // }, [dispatch]);

  const handleUndo = useCallback(() => {
    dispatch(undo());
  }, [dispatch]);

  const handleRedo = useCallback(() => {
    dispatch(redo());
  }, [dispatch]);

  const handleCreate = useCallback(() => {
    if (websiteMetadata) {
      dispatch(createNewWebsite(websiteMetadata));
    } else {
      console.error("Website metadata is null");
    }
  }, [dispatch, websiteMetadata]);

  return (
    <ElementProvider websiteId={id}>
      <BuilderContainer>
        <WebsiteBuilderNavbar
          onUndo={handleUndo}
          onRedo={handleRedo}
          onCreate={handleCreate}
        />
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
