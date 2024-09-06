import { css } from "styled-components";
import { ContentProps } from "../BuilderInterface";
import styled from "styled-components";
import Image from "next/image";

export const commonStyles = css<ContentProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: transparent;
  font-size: ${(props) => props.$config.fontSize}px;
  font-weight: ${(props) => props.$config.fontWeight};
  text-align: ${(props) => props.$config.textAlign};
  line-height: ${(props) => props.$config.lineHeight};
  letter-spacing: ${(props) => props.$config.letterSpacing}px;
  color: ${(props) => props.$config.textColor};
  opacity: ${(props) => props.$config.opacity};
  font-family: ${(props) => props.$config.fontFamily};
  box-sizing: border-box;
`;

export const PElement = styled.p<ContentProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background: transparent;
  font-size: ${(props) => props.$config.fontSize}px;
  color: ${(props) => props.$config.textColor};
  opacity: ${(props) => props.$config.opacity};
  letter-spacing: ${(props) => props.$config.letterSpacing}px;
  line-height: ${(props) => props.$config.lineHeight};
  text-align: ${(props) => props.$config.textAlign};
  font-weight: ${(props) => props.$config.fontWeight};
  font-family: ${(props) => props.$config.fontFamily};
  box-sizing: border-box;
  cursor: text;
`;

export const ButtonElement = styled.button<ContentProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-width: 0;
  font-size: ${(props) => props.$config.fontSize}px;
  color: ${(props) => props.$config.textColor};
  opacity: ${(props) => props.$config.opacity};
  font-family: ${(props) => props.$config.fontFamily};
  background-color: ${(props) => props.$config.backgroundColor};
  padding: ${(props) => props.$config.boxModelEditor?.padding.join("% ") + "%"};
  margin: ${(props) => props.$config.boxModelEditor?.margin.join("% ") + "%"};
  border-width: ${(props) => props.$config.borderWidth}px;
  border-style: ${(props) => props.$config.borderStyle};
  border-color: ${(props) => props.$config.borderColor};
  &:hover {
    background-color: ${(props) => props.$config.hoverBackgroundColor};
  }
  &:active {
    background-color: ${(props) => props.$config.activeBackgroundColor};
  }
`;

export const ImageWrapperElement = styled.div<ContentProps>`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  border: ${(props) => props.$config.border};
  border-radius: ${(props) => `${props.$config?.borderRadius}%`};
`;

export const ImageElement = styled(Image)<ContentProps>`
  object-fit: ${(props) => props.$config?.objectFit};
`;
