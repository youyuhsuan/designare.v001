"use client";

import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  Modifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSelector } from "react-redux";
import { useElementContext, useElementsDebug } from "./Slider/ElementContext";
import { SiteContainer } from "@/src/Components/WebsiteBuilder/SiteContainer";
import { LocalElementType } from "@/src/Components/WebsiteBuilder/BuilderInterface";
import LayoutElement from "./BuilderElement/LayoutElement";
import FreeDraggableElement from "./BuilderElement/FreeDraggableElement";
import { useState } from "react";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import styled from "styled-components";
import {
  selectCanvasHeight,
  selectSiteWidth,
} from "@/src/libs/features/websiteBuilder/websiteBuliderSelector";

export const CanvasAreaContainer = styled.div`
  width: 100%;
`;
const customModifier: Modifier = ({ transform, active }) => {
  // 假設 LayoutElement 的 data 中有一個 isLayout 屬性
  if (active && active.data.current && active.data.current.isLayout) {
    return {
      ...transform,
      x: 0, // 將 x 設置為 0，只允許垂直移動
    };
  }
  return transform;
};

export const CanvasArea: React.FC = () => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const siteWidth = useSelector(selectSiteWidth);
  const canvasHeight = useSelector(selectCanvasHeight);

  const {
    elements,
    updateElementPosition,
    updateElement,
    deleteElement,
    reorderElement: reorderElements,
    setSelectedElement,
  } = useElementContext();

  useElementsDebug();

  // 添加日誌來檢查 elements 的內容
  // useEffect(() => {
  //   console.log("Current elements:", elements);
  // }, [elements]);

  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleElementClick = (id: string) => {
    // console.log("Element clicked:", id);
    setSelectedId(id);
    const selectedElement = elements.find((el) => el.id === id) || null;
    // console.log("Selected element:", selectedElement);
    setSelectedElement(selectedElement);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      // console.log("Canvas clicked");
      setSelectedId(null);
      setSelectedElement(null);
    }
  };

  // 修改渲染邏輯，添加錯誤處理
  if (!Array.isArray(elements) || elements.length === 0) {
    console.warn("No elements to render or elements is not an array");
  }

  const handleDragStart = (event: DragStartEvent) => {
    // console.log("Drag started:", event.active.id);
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;

    if (!active) {
      console.error("Invalid 'active' data:", active);
      return;
    }

    const activeElement = elements.find((el) => el.id === active.id);

    if (!activeElement) {
      console.warn("Active element not found");
      return;
    }

    // console.log("Drag ended. Active element:", activeElement);
    // console.log("Over element:", over);
    // console.log("Delta:", delta);

    if (over) {
      if (activeElement.isLayout) {
        // 布局元素的逻辑
        if (active.id !== over.id) {
          const layoutElements = elements.filter((el) => el.isLayout);
          const layoutElementIds = layoutElements.map((el) => el.id);
          const oldIndex = layoutElementIds.findIndex((id) => id === active.id);
          const newIndex = layoutElementIds.findIndex((id) => id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            const newOrder = arrayMove(layoutElementIds, oldIndex, newIndex);
            // console.log("Reordering elements:", newOrder);
            reorderElements(newOrder);
          }
        }
      } else {
        // 自由拖拉元素：更新位置
        updateElementPosition(active.id, {
          x: (activeElement.position?.x || 0) + (delta?.x || 0),
          y: (activeElement.position?.y || 0) + (delta?.y || 0),
        });
      }
    } else if (!activeElement.isLayout && delta) {
      // 如果没有 over 对象，只更新自由拖拉元素的位置
      updateElementPosition(active.id, {
        x: (activeElement.position?.x || 0) + delta.x,
        y: (activeElement.position?.y || 0) + delta.y,
      });
    }

    setActiveId(null);
  };

  const handleElementUpdate = (
    id: string,
    updates: Partial<LocalElementType>
  ) => {
    // console.log("handleElementUpdate called", id, updates);
    updateElement(id, updates);
  };

  const layoutElements = elements.filter((el) => el.isLayout);
  const freeDraggableElements = elements.filter((el) => !el.isLayout);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges, customModifier]}
    >
      <CanvasAreaContainer>
        <SiteContainer
          width={siteWidth}
          height={canvasHeight}
          onClick={handleCanvasClick}
        >
          <SortableContext
            items={layoutElements.map((el) => el.id)}
            strategy={verticalListSortingStrategy}
          >
            {layoutElements.map((element) => (
              <LayoutElement
                key={element.id}
                {...element}
                onUpdate={(updates: any) =>
                  handleElementUpdate(element.id, updates)
                }
                onDelete={() => deleteElement(element.id)}
                isSelected={element.id === selectedId}
                onClick={() => handleElementClick(element.id)}
              />
            ))}
          </SortableContext>

          {freeDraggableElements.map((element) => (
            <FreeDraggableElement
              key={element.id}
              {...element}
              onUpdate={(updates) => handleElementUpdate(element.id, updates)}
              onDelete={() => deleteElement(element.id)}
              isSelected={element.id === selectedId}
              onClick={() => handleElementClick(element.id)}
            />
          ))}
        </SiteContainer>
      </CanvasAreaContainer>
    </DndContext>
  );
};
