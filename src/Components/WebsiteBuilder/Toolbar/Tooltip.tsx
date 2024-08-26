import styled from "styled-components";

const Tooltip = styled.div`
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.light};
  border-radius: 5px;
  padding: 8px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  visibility: hidden;
  z-index: 10;
  text-align: center;
  width: max-content;
  max-width: 200px;
`;

const TooltipTitle = styled(Tooltip)`
  background: #333;
`;

const TooltipImage = styled(Tooltip)`
  background: #555;
`;

const TooltipButton = styled(Tooltip)`
  background: #777;
`;

const TooltipColumns = styled(Tooltip)`
  background: #999;
  color: #000;
`;

const TooltipContainer = styled(Tooltip)`
  background: #aaa;
  color: #000;
`;

const TooltipList = styled(Tooltip)`
  background: #bbb;
  color: #000;
`;
