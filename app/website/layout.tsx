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
  convertTimestamp,
  formatTimestamp,
} from "@/src/utilities/convertTimestamp";
import { selectWebsiteMetadata } from "@/src/libs/features/websiteBuilder/websiteMetadataSelector";
import { useParams, useRouter } from "next/navigation";
import { WebsiteMetadata } from "@/src/type/website";
import { Timestamp } from "firebase/firestore";

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

  const params = useParams();
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const handlePublishWebsite = async () => {
    try {
      const response = await fetch(`/api/website/${id}/metadata`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "return-updated-data": "true",
        },
        body: JSON.stringify({
          url: `${baseUrl}/publish/${id}`,
          status: "published",
          publishedAt: convertTimestamp(Timestamp.now()),
          lastModified: convertTimestamp(Timestamp.now()),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.metadata.url;
    } catch (err) {
      console.error("Error updating website:", err);
      throw err;
    }
  };

  return (
    <ElementProvider websiteId={id}>
      <BuilderContainer>
        <WebsiteBuilderNavbar
          id={id}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onPublish={handlePublishWebsite}
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
