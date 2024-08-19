"use client";

import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
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
import { customModifier } from "@/src/utilities/customModifier";

export const CanvasAreaContainer = styled.div`
  width: 100%;
`;

export const CanvasArea: React.FC = () => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 從 Redux store 中選擇畫布的寬度和高度
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

  // 管理當前拖拽元素的 ID 和選中的元素 ID
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 處理元素點擊事件，設定選中的元素
  const handleElementClick = (id: string) => {
    // console.log("Element clicked:", id);
    setSelectedId(id);
    const selectedElement = elements.find((el) => el.id === id) || null;
    // console.log("Selected element:", selectedElement);
    setSelectedElement(selectedElement);
  };

  // 處理畫布點擊事件，取消選中狀態
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      // console.log("Canvas clicked");
      setSelectedId(null);
      setSelectedElement(null);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    // console.log("Drag started:", event.active.id);
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;

    if (!active) {
      console.error("無效的 'active' 數據:", active);
      return;
    }

    const activeElement = elements.find((el) => el.id === active.id);

    if (!activeElement) {
      console.warn("找不到活動元素");
      return;
    }

    if (activeElement.isLayout) {
      // 處理布局元素的拖拽
      if (over && active.id !== over.id) {
        const layoutElements = elements.filter((el) => el.isLayout);
        const layoutElementIds = layoutElements.map((el) => el.id);
        const oldIndex = layoutElementIds.findIndex((id) => id === active.id);
        const newIndex = layoutElementIds.findIndex((id) => id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newOrder = arrayMove(layoutElementIds, oldIndex, newIndex);
          reorderElements(newOrder); // 更新布局元素的順序
        }
      }
    } else {
      // 自由拖放元素：更新位置
      if (delta) {
        const newPosition = {
          x: (activeElement.config?.position?.x || 0) + delta.x,
          y: (activeElement.config?.position?.y || 0) + delta.y,
        };
        // console.log("Updating free element position", {
        //   id: active.id,
        //   Position,
        // });
        updateElementPosition(active.id, {
          position: newPosition,
        });
      } else {
        console.warn("自由元素的 delta 未定義", active.id);
      }
    }
    setActiveId(null); // 清除當前拖拽的元素 ID
  };

  // 處理元素更新
  const handleElementUpdate = (
    id: string,
    updates: Partial<LocalElementType>
  ) => {
    console.log("handleElementUpdate 被調用", id, updates);
    updateElement(id, updates);
  };

  // 過濾出布局元素和自由拖放元素
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
