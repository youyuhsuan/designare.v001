"use client";

import styled from "styled-components";
import graySquares from "@/src/image/graySquares.svg";

const Background = styled.div`
  &::after {
    content: "";
    background-image: url(${graySquares});
    background-size: 20px 20px;
    opacity: 0.125;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    pointer-events: none;
  }
`;

const SitePreviewer: React.FC = () => (
  <>
    <Background>{/* 其他内容 */}</Background>
  </>
);

export default SitePreviewer;
