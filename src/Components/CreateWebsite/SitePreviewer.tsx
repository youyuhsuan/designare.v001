"use client";

import React from "react";
import styled from "styled-components";
import graySquares from "@/public/svg/graySquares.svg";

const MainContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: calc(100vh - 60px);
  overflow: hidden;
`;

const Background = styled.div<{ backgroundImage: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  background-image: url(${(props) => props.backgroundImage});
  background-size: 20px 20px;
  opacity: 0.125;
`;

const PreviewContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  height: 80%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  z-index: 1;
`;

const PreviewHeader = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const SitePreviewer: React.FC = () => {
  const backgroundImageUrl =
    typeof graySquares === "object" && "src" in graySquares
      ? graySquares.src
      : (graySquares as string);

  return (
    <MainContent>
      <Background backgroundImage={backgroundImageUrl} />
      <PreviewContainer>
        <PreviewHeader></PreviewHeader>
      </PreviewContainer>
    </MainContent>
  );
};

export default SitePreviewer;
