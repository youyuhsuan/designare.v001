import styled from "styled-components";
import React from "react";

const theme = {
  handleSize: "10px",
  handleColor: "blue",
  handleOffset: "-5px",
};

const ResizeHandleBase = styled.div`
  position: absolute;
  width: var(--handle-size, ${theme.handleSize});
  height: var(--handle-size, ${theme.handleSize});
  background-color: var(--handle-color, ${theme.handleColor});
  z-index: 10;
`;

const ResizeHandleContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

type HandlePosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "right"
  | "top"
  | "bottom";

const createPositionedHandle = (position: HandlePosition) => styled(
  ResizeHandleBase
)`
  ${() => {
    switch (position) {
      case "top-left":
        return `top: ${theme.handleOffset}; left: ${theme.handleOffset}; cursor: nwse-resize;`;
      case "top-right":
        return `top: ${theme.handleOffset}; right: ${theme.handleOffset}; cursor: nesw-resize;`;
      case "bottom-left":
        return `bottom: ${theme.handleOffset}; left: ${theme.handleOffset}; cursor: nesw-resize;`;
      case "bottom-right":
        return `bottom: ${theme.handleOffset}; right: ${theme.handleOffset}; cursor: nwse-resize;`;
      case "left":
        return `left: ${theme.handleOffset}; top: 50%; transform: translateY(-50%); cursor: ew-resize;`;
      case "right":
        return `right: ${theme.handleOffset}; top: 50%; transform: translateY(-50%); cursor: ew-resize;`;
      case "top":
        return `top: ${theme.handleOffset}; left: 50%; transform: translateX(-50%); cursor: ns-resize;`;
      case "bottom":
        return `bottom: ${theme.handleOffset}; left: 50%; transform: translateX(-50%); cursor: ns-resize;`;
      default:
        return "";
    }
  }}
`;

const TopLeftHandle = createPositionedHandle("top-left");
const TopRightHandle = createPositionedHandle("top-right");
const BottomLeftHandle = createPositionedHandle("bottom-left");
const BottomRightHandle = createPositionedHandle("bottom-right");
const LeftHandle = createPositionedHandle("left");
const RightHandle = createPositionedHandle("right");
const TopHandle = createPositionedHandle("top");
const BottomHandle = createPositionedHandle("bottom");

interface ResizeHandlesProps {
  onResize: (
    event: React.MouseEvent<HTMLDivElement>,
    position: HandlePosition
  ) => void;
}

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResize }) => (
  <ResizeHandleContainer>
    <TopLeftHandle onMouseDown={(e) => onResize(e, "top-left")} />
    <TopRightHandle onMouseDown={(e) => onResize(e, "top-right")} />
    <BottomLeftHandle onMouseDown={(e) => onResize(e, "bottom-left")} />
    <BottomRightHandle onMouseDown={(e) => onResize(e, "bottom-right")} />
    <LeftHandle onMouseDown={(e) => onResize(e, "left")} />
    <RightHandle onMouseDown={(e) => onResize(e, "right")} />
    <TopHandle onMouseDown={(e) => onResize(e, "top")} />
    <BottomHandle onMouseDown={(e) => onResize(e, "bottom")} />
  </ResizeHandleContainer>
);

export default ResizeHandles;
