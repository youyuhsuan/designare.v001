"use client";

import { useSelector } from "react-redux";
import { useElementContext } from "./Slider/ElementContext";
import { SiteContainer } from "@/src/Components/WebsiteBuilder/SiteContainer";
import { GlobalState } from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { RenderElement } from "@/src/Components/WebsiteBuilder/RenderElement";
import React, { useEffect } from "react";

export const CanvasArea: React.FC = () => {
  const siteWidth = useSelector((state: GlobalState) => state.siteWidth);
  const { elements } = useElementContext();

  console.log("Elements:", elements); // 打印 elements 数据

  useEffect(() => {
    console.log("Elements updated in CanvasArea:", elements);
  }, [elements]);

  return (
    <div className="canvas-area">
      <SiteContainer width={siteWidth}>
        {elements.map((element) => (
          <RenderElement key={element.id} element={element} />
        ))}
      </SiteContainer>
    </div>
  );
};
