"use client";

import React from "react";
import FreeDraggableElement from "@/src/Components/WebsiteBuilder/BuilderElement/FreeDraggableElement";
// import LayoutElement from "@/src/Components/WebsiteBuilder/BuilderElement/LayoutElement";

// 確保這個接口與您的類型定義文件中的定義一致
interface ElementData {
  id: string;
  type: string;
  content: React.ReactNode;
  position: { x: number; y: number };
  height: number;
  isLayout: boolean;
  // 其他可能的屬性...
}

interface RenderElementProps {
  element: ElementData;
}

export const RenderElement: React.FC<RenderElementProps> = ({ element }) => {
  console.log("RenderElement props:", element); // 檢查傳遞的 props

  // if (element.isLayout) {
  //   return <LayoutElement {...element} />;
  // }

  switch (element.type) {
    case "text":
    case "image":
    case "button":
    case "columns":
    case "container":
    case "list":
      return (
        <FreeDraggableElement
          id={element.id}
          content={element.content}
          position={element.position}
          height={element.height}
          type={element.type}
          isLayout={element.isLayout}
        />
      );
    default:
      console.warn(`Unknown element type: ${element.type}`);
      return null;
  }
};

export default RenderElement;
