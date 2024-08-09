// 使用 Redux 獲取全局設置，使用 ElementContext 管理局部元素

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import styled from "styled-components";

const StyledDroppableArea = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  background-color: #f0f0f0;
`;

export function DroppableArea({ children }: { children: React.ReactNode }) {
  // 顯示組件的子元素
  const { setNodeRef } = useDroppable({
    id: "viewport",
  });
  // 該組件設置為可接受拖放的區域

  return <StyledDroppableArea ref={setNodeRef}>{children}</StyledDroppableArea>;
}
