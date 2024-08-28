import { css } from "styled-components";
import { ContentProps } from "../BuilderInterface";

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
  letter-spacing: ${(props) => props.$config.letterSpacing};
  color: ${(props) => props.$config.textColor};
  opacity: ${(props) => props.$config.opacity};
  font-family: ${(props) => props.$config.fontFamily};
  box-sizing: border-box;
`;
