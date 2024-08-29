"use client";

import React from "react";
import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const LoadingSpinner = styled.div`
  border: 4px solid #333;
  border-top: 4px solid #f3f3f3;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Loading: React.FC = () => (
  <LoadingContainer>
    <LoadingSpinner />
  </LoadingContainer>
);

export default Loading;
