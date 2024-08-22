"use client";

import React from "react";
import styled from "styled-components";

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #222222; // 使用一个固定的颜色，避免主题相关的问题
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

const LoadingPage: React.FC = () => (
  <LoadingContainer>
    <LoadingSpinner />
  </LoadingContainer>
);

export default LoadingPage;
