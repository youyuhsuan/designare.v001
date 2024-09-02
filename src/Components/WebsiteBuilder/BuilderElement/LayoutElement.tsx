"use client";

import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";
import {
  LayoutElementProps,
  ContentProps,
} from "@/src/Components/WebsiteBuilder/BuilderInterface/";
import { useElementContext } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import RenderContent from "../../../Hooks/RenderContent";

const SectionWrapper = styled.div<ContentProps>`
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isDragging ? "scale(1.02)" : "scale(1)")};
  position: relative;
`;

const DragHandle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 20px;
  background-color: ${(props) => props.theme.colors.background};
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 5px;

  &::before {
    content: "⋮⋮";
    color: ${(props) => props.theme.colors.primary};
  }
`;

const Section = styled.div<ContentProps>`
  height: 100%;
  padding: ${(props) =>
    props.$config.boxModelEditor?.padding.join("px ") + "px"};
  margin: ${(props) => props.$config.boxModelEditor?.margin.join("px ") + "px"};
  background-color: ${(props) =>
    props.$config.backgroundColor?.defaultColor || "transparent"};
  opacity: ${(props) =>
    props.$config.backgroundColor?.defaultOpacity !== undefined
      ? props.$config.backgroundColor.defaultOpacity / 100
      : 1};
`;

const SectionContent = styled.div<ContentProps>`
  padding: ${(props) =>
    props.$config.boxModelEditor?.padding.join("px ") + "px"};
  margin: ${(props) => props.$config.boxModelEditor?.margin.join("px ") + "px"};
  height: 100%;
  ${(props) =>
    props.$config?.media?.type === "image" &&
    `
    background-image: url(${props.$config.media.url});
    background-size: cover;
    background-position: center;
  `}
`;

const ResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 10px;
  background-color: ${(props) => props.theme.colors.background};
  cursor: row-resize;
`;

const LayoutElement: React.FC<LayoutElementProps> = ({
  id,
  content,
  config,
  type,
  elementType,
  onUpdate,
  onDelete,
  isSelected,
  path = [],
}) => {
  const { updateSelectedElement, handleElementSelect } = useElementContext();
  const elementRef = useRef<HTMLDivElement>(null);
  const [elementHeight, setElementHeight] = useState(config.size.height);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  useEffect(() => {
    console.log("LayoutElement selectedChildId updated:", selectedChildId);
  }, [selectedChildId]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // 停止事件冒泡，防止事件被傳播到父級元素
      console.log("點擊事件被處理，停止冒泡"); // 記錄事件處理訊息

      // 調用 handleElementSelect 函數，選擇指定的元素
      handleElementSelect({ id, path: [...path, id] });

      console.log("處理選擇元素的操作，元素 ID:", id, "路徑:", [...path, id]); // 記錄元素選擇操作及其路徑
    },
    [id, path, handleElementSelect]
  );

  useEffect(() => {
    setElementHeight(config.size.height);
  }, [config.size.height]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Backspace" &&
        document.activeElement === elementRef.current
      ) {
        event.preventDefault();
        event.stopPropagation();
        onDelete();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [id, onDelete]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      isLayout: true,
    },
  });

  // 使用 useMemo 儲存計算結果，僅在依賴項變更時重新計算
  const style = useMemo(() => {
    const baseStyle: React.CSSProperties = {
      width: config?.useMaxWidth ? "100%" : `${config?.size?.width || 100}%`,
      height: `${elementHeight}px`,
      transform: CSS.Transform.toString(transform),
      transition,
      touchAction: "none",
    };

    if (config?.responsiveBehavior === "fitWidth") {
      baseStyle.width = "100%";
    }

    return {
      ...baseStyle,
      ...(config || {}),
      transform: CSS.Transform.toString(transform),
      transition,
    };
  }, [config, elementHeight, transform, transition]);

  const updateElementHeight = useCallback(
    (newHeight: number) => {
      setElementHeight(newHeight);
      const newConfig = {
        ...config,
        size: {
          ...config.size,
          height: newHeight,
        },
      };
      onUpdate(newConfig);
    },
    [config, onUpdate]
  );

  const handleResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startY = e.clientY;
      const startHeight = elementHeight;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaY = e.clientY - startY;
        const newHeight = Math.max(100, startHeight + deltaY);
        updateElementHeight(newHeight);
        updateSelectedElement(id, "config.size.height", newHeight);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [elementHeight, updateElementHeight, updateSelectedElement, id]
  );

  const handleKeyResize = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const delta = e.key === "ArrowUp" ? -10 : 10;
        const newHeight = Math.max(100, elementHeight + delta);
        updateElementHeight(newHeight);
        console.log(
          `Element ${id} - Arrow key resize, new height: ${newHeight}px`
        );
      }
    },
    [id, elementHeight, updateElementHeight]
  );

  if (!config || typeof config !== "object") {
    console.error("Invalid config:", config);
    return null;
  }

  return (
    <SectionWrapper
      ref={setNodeRef}
      style={style}
      role="region"
      $config={config}
      aria-label={`${type} content`}
      $isDragging={isDragging}
      $isSelected={isSelected}
      onClick={handleClick}
    >
      <Section $config={config} ref={elementRef} tabIndex={0}>
        {isSelected && (
          <DragHandle
            {...attributes}
            {...listeners}
            role="button"
            aria-label="Drag to reorder vertically"
            tabIndex={0}
          />
        )}
        <SectionContent $config={config}>
          {RenderContent({
            type,
            config,
            elementType,
            selectedId: isSelected ? id : null,
            onUpdate,
            path: [...path, id],
          })}
        </SectionContent>
        {isSelected && (
          <ResizeHandle
            role="slider"
            aria-label="Resize section"
            aria-valuemin={100}
            aria-valuemax={1000}
            aria-valuenow={elementHeight}
            tabIndex={0}
            onMouseDown={handleResize}
            onKeyDown={handleKeyResize}
          />
        )}
      </Section>
    </SectionWrapper>
  );
};

export default LayoutElement;
