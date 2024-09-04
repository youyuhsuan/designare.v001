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

const SectionWrapper = styled.div<ContentProps>`
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  transition: transform 0.2s ease, width 0.3s ease, height 0.3s ease;
  transform: ${(props) => (props.$isDragging ? "scale(1.02)" : "scale(1)")};
  position: relative;
  width: ${(props) => {
    if (
      props.$config?.useMaxWidth ||
      props.$config?.responsiveBehavior === "fitWidth"
    ) {
      return "100%";
    }
    return props.$config?.elementType === "sidebarLayout" ||
      props.$config?.elementType === "columnizedLayout"
      ? "100%"
      : `${props.$config?.size?.width || 100}%`;
  }};
  height: ${(props) => `${props.$config?.size?.height || 100}px`};
  display: flex;
  flex-direction: ${(props) =>
    props.$config?.elementType === "sidebarLayout" ||
    props.$config?.elementType === "columnizedLayout"
      ? "row"
      : "column"};
  gap: ${(props) => `${props.$config?.gap || 0}px`};
`;

const SectionContent = styled.div<ContentProps>`
  flex: ${(props) => {
    if (
      props.$config?.elementType === "sidebarLayout" ||
      props.$config?.elementType === "columnizedLayout"
    ) {
      return props.$width ? `0 0 ${props.$width}` : "1";
    }
    return "1";
  }};
  padding: ${(props) =>
    props.$config?.boxModelEditor?.padding.join("px ") + "px"};
  margin: ${(props) =>
    props.$config?.boxModelEditor?.margin.join("px ") + "px"};
  background-color: ${(props) =>
    props.$config?.backgroundColor?.defaultColor || "transparent"};
  opacity: ${(props) =>
    props.$config?.backgroundColor?.defaultOpacity !== undefined
      ? props.$config?.backgroundColor.defaultOpacity / 100
      : 1};
  height: 100%;
  ${(props) =>
    props.$config?.media?.type === "image" &&
    `
    background-image: url(${props.$config.media.url});
    background-size: cover;
    background-position: center;
  `}
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
  display: flex;
  flex-direction: ${(props) => props.$flexDirection || "row"};
  width: 100%;
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

const ResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 10px;
  background-color: ${(props) => props.theme.colors.background};
  cursor: row-resize;
`;

const GridContainer = styled.div<{
  $config: any;
  $columns: number;
  $gap: number;
}>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns}, 1fr);
  gap: ${(props) => props.$gap}px;
  width: 100%;
  height: 100%;
`;

const LayoutElement: React.FC<LayoutElementProps> = ({
  id,
  content,
  config,
  type,
  elementType,
  onUpdate,
  onDelete,
  onSelect,
  isSelected,
}) => {
  const { updateSelectedElement } = useElementContext();

  const elementRef = useRef<HTMLDivElement>(null);
  const [elementHeight, setElementHeight] = useState(
    config?.size?.height ?? 100
  );

  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const handleElementSelect = useCallback(
    (selectedId: string, childPath: string[] = []) => {
      const fullPath = [id, ...childPath];
      if (selectedId === id) {
        if (lastClickedId === id) {
          console.log("第二次點擊同一元素");
          setClickCount(2);

          if (config.children && config.children.length > 0) {
            const firstChildId = config.children[0].id;
            console.log("選擇第一個子元素", firstChildId);
            onSelect?.({ id: firstChildId, path: [...fullPath, firstChildId] });
          } else {
            console.log("沒有子元素，保持當前選擇");
            onSelect?.({ id: selectedId, path: fullPath });
          }
        } else {
          setClickCount(1);
          onSelect?.({ id: selectedId, path: fullPath });
        }
      } else {
        console.log("第一次點擊，選擇當前元素");
        setClickCount(1);
        onSelect?.({ id: selectedId, path: fullPath });
      }
      setTimeout(() => {
        setClickCount(0);
        setLastClickedId(null);
      }, 300); // 300毫秒後重置，可以根據需要調整
    },
    [id, onSelect, config.children, lastClickedId]
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log("LayoutElement 處理點擊事件");
      handleElementSelect(id);
    },
    [id, handleElementSelect]
  );

  useEffect(() => {
    if (config?.size?.height !== undefined) {
      console.log("LayoutElement 高度已更新:", config.size.height);
      setElementHeight(config?.size?.height);
    }
  }, [config?.size?.height]);

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

  const style = useMemo(() => {
    const baseStyle: React.CSSProperties = {
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
      console.log("更新元素高度為:", newHeight);
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
      console.log("Resize handle mouse down");
      const startY = e.clientY;
      const startHeight = elementHeight;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaY = e.clientY - startY;
        const newHeight = Math.max(100, startHeight + deltaY);
        console.log("Resizing: new height", newHeight);
        updateElementHeight(newHeight);
        updateSelectedElement(id, "config.size.height", newHeight);
      };

      const handleMouseUp = () => {
        console.log("Resize handle mouse up");
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
        console.log(
          `Element ${id} - Arrow key resize, new height: ${newHeight}px`
        );
        updateElementHeight(newHeight);
      }
    },
    [id, elementHeight, updateElementHeight]
  );

  const renderChild = useCallback(
    (childConfig: any, index: number) => {
      if (!childConfig) {
        console.warn(`第 ${index} 個子元素的配置是 undefined`);
        return null;
      }

      return (
        <LayoutElement
          key={childConfig.id || index}
          {...childConfig}
          onUpdate={(newChildConfig) => {
            const newChildren = [...(config.children || [])];
            newChildren[index] = { ...childConfig, ...newChildConfig };
            onUpdate({ ...config, children: newChildren });
          }}
          onSelect={({ id: childId, path }) => {
            handleElementSelect(childId, [childConfig.id, ...path]);
          }}
          isSelected={
            isSelected && config.children?.[index]?.id === childConfig.id
          }
          o
        />
      );
    },
    [config, onUpdate, handleElementSelect, isSelected]
  );

  const renderContent = useMemo(() => {
    console.log("渲染元素內容，元素類型:", elementType, "配置:", config);

    if (!config) {
      console.error("配置是 undefined");
      return null;
    }

    const renderChildren = (
      children: any[] | undefined,
      startIndex: number,
      endIndex?: number
    ) => {
      if (!Array.isArray(children)) {
        console.warn("子元素不是陣列:", children);
        return null;
      }
      return children
        .slice(startIndex, endIndex)
        .map((child, index) => renderChild(child, startIndex + index));
    };

    const children = config.children || [];
    console.log("子元素:", children);

    const handleSectionContentClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleElementSelect(id);
    };

    switch (elementType) {
      case "sidebarLayout":
      case "columnizedLayout":
        return (
          <>
            <SectionContent
              $config={config}
              $width={`${config.columnWidths?.left || 50}%`}
              onClick={handleSectionContentClick}
            >
              {renderChildren(children, 0, 1)}
            </SectionContent>
            <SectionContent
              $config={config}
              $width={`${
                config.columnWidths?.middle ||
                (elementType === "sidebarLayout" ? 50 : 25)
              }%`}
              onClick={handleSectionContentClick}
            >
              {elementType === "columnizedLayout" &&
              config.middleColumnSplit ? (
                <>
                  <div style={{ height: "50%" }}>
                    {renderChildren(children, 1, 2)}
                  </div>
                  <div style={{ height: "50%" }}>
                    {renderChildren(children, 2, 3)}
                  </div>
                </>
              ) : (
                renderChildren(children, 1, 2)
              )}
            </SectionContent>
            {(elementType === "columnizedLayout" ||
              config.columnWidths?.right) && (
              <SectionContent
                $config={config}
                $width={`${config.columnWidths?.right || 25}%`}
                onClick={handleSectionContentClick}
              >
                {renderChildren(
                  children,
                  elementType === "columnizedLayout" && config.middleColumnSplit
                    ? 3
                    : 2
                )}
              </SectionContent>
            )}
          </>
        );

      case "gridLayout":
        return (
          <GridContainer
            $config={config}
            $columns={config.columns || 3}
            $gap={config.gap || 5}
            onClick={handleSectionContentClick}
          >
            {renderChildren(children, 0)}
          </GridContainer>
        );

      default:
        return (
          <SectionContent $config={config} onClick={handleSectionContentClick}>
            {renderChildren(children, 0)}
          </SectionContent>
        );
    }
  }, [elementType, config, renderChild, handleElementSelect, id]);

  return (
    <SectionWrapper
      ref={setNodeRef}
      style={{
        ...style,
        border: isSelected ? "2px solid blue" : "1px solid gray",
      }}
      role="region"
      $config={config}
      aria-label={`${type} content`}
      $isDragging={isDragging}
      onClick={(e) => {
        console.log(`SectionWrapper clicked: id=${id}`);
        handleElementSelect(id, []);
      }}
      $isSelected={isSelected}
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
        {renderContent}
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
