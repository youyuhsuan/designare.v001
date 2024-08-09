// 定義與全局元素庫相關的接口和類型

"use client";

import React from "react";
import styled from "styled-components";
import { WebsiteBuilder } from "@/src/Components/WebsiteBuilder/WebsiteBuilder";
import { Sidebar } from "./Sidebar/Sidebar";

const BuilderWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const CanvasArea = styled.div`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  padding: 20px;
  overflow: auto;
`;

export function BuilderInterface() {
  return (
    <BuilderWrapper>
      <Sidebar />
      <CanvasArea>
        <WebsiteBuilder />
      </CanvasArea>
    </BuilderWrapper>
  );
}
