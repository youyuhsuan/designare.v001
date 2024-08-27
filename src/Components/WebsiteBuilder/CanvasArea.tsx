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
import {
  FreeDraggableElementData,
  LayoutElementData,
  LocalElementType,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import LayoutElement from "./BuilderElement/LayoutElement";
import FreeDraggableElement from "./BuilderElement/FreeDraggableElement";
import { useEffect, useMemo, useState } from "react";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import styled from "styled-components";
import {
  selectCurrentDevice,
  selectCurrentLayoutSettings,
} from "@/src/libs/features/websiteBuilder/globalSelect";
import { customModifier } from "@/src/utilities/customModifier";
import { useAppDispatch } from "@/src/libs/hook";
import { setLayoutSettings } from "@/src/libs/features/websiteBuilder/globalSettingsSlice";
import { selectElementsArray } from "@/src/libs/features/websiteBuilder/elementLibrarySelector";
import { fetchElementLibrary } from "@/src/libs/features/websiteBuilder/websiteMetadataThunk";
import isEqual from "lodash/isEqual";
import { updateElementInstance } from "@/src/libs/features/websiteBuilder/elementLibrarySlice";

// Styled-component 定義了畫布區域的容器樣式
const CanvasAreaContainer = styled.div`
  width: 100%;
`;

interface CanvasAreaProps {
  id?: string; // 用於標識畫布的 ID
}

// CanvasArea 組件
export const CanvasArea: React.FC<CanvasAreaProps> = ({ id }) => {
  // 設置拖拽感應器
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dispatch = useAppDispatch();
  const currentDevice = useSelector(selectCurrentDevice);
  const currentLayoutSettings = useSelector(selectCurrentLayoutSettings);

  // 自定義比較函數，用於比較元素數組的變化
  const customCompare = (prev: any[], next: any[]) => {
    const isEqualResult = isEqual(prev, next);
    // console.log("Custom compare result:", isEqualResult);
    // console.log("Prev:", prev);
    // console.log("Next:", next);
    return isEqualResult;
  };

  // 從 Redux 中選擇元素數組，並使用自定義比較函數
  const elementArray = useSelector(selectElementsArray, customCompare);

  // 當元素數組變化時，打印變化的元素數組
  // useEffect(() => {
  //   console.log("Element array changed:", elementArray);
  // }, [elementArray]);

  // 載入元素庫
  useEffect(() => {
    dispatch(fetchElementLibrary(id as string));
  }, [dispatch, id]);

  // 使用 useMemo 計算布局元素和自由拖拽元素
  const { layoutElements, freeDraggableElements } = useMemo(() => {
    return elementArray.reduce<{
      layoutElements: LayoutElementData[];
      freeDraggableElements: FreeDraggableElementData[];
    }>(
      (acc, element) => {
        if (element.isLayout) {
          acc.layoutElements.push(element as LayoutElementData);
        } else {
          acc.freeDraggableElements.push(element as FreeDraggableElementData);
        }
        return acc;
      },
      { layoutElements: [], freeDraggableElements: [] }
    );
  }, [elementArray]);

  // 當布局元素或自由拖拽元素變化時，打印這些元素
  useEffect(() => {
    console.log("Layout elements:", layoutElements);
    console.log("Free draggable elements:", freeDraggableElements);
  }, [layoutElements, freeDraggableElements]);

  // 使用 ElementContext 中的函數和狀態
  const {
    elements,
    updateElementPosition,
    updateElement,
    deleteElement,
    reorderElement: reorderElements,
    setSelectedElement,
  } = useElementContext();

  // useElementsDebug(); // 啟用元素調試（如果有的話）

  // 設置默認的佈局設置，根據當前設備更新設置
  useEffect(() => {
    const defaultSettings = {
      desktop: {
        siteWidth: "1200px",
        canvasHeight: "1200px",
      },
      tablet: {
        siteWidth: "768px",
        canvasHeight: "1024px",
      },
      mobile: {
        siteWidth: "360px",
        canvasHeight: "640px",
      },
    };

    if (
      JSON.stringify(currentLayoutSettings) !==
      JSON.stringify(defaultSettings[currentDevice])
    ) {
      dispatch(
        setLayoutSettings({
          device: currentDevice,
          settings: defaultSettings[currentDevice],
        })
      );
    }
  }, [currentDevice, currentLayoutSettings, dispatch]);

  // 管理當前拖拽元素的 ID 和選中的元素 ID
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 處理元素點擊事件，設定選中的元素
  const handleElementMouseUp = (id: string) => {
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

  // 處理拖拽開始事件
  const handleDragStart = (event: DragStartEvent) => {
    // console.log("Drag started:", event.active.id);
    setActiveId(event.active.id);
  };

  // 處理拖拽結束事件
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

        if (typeof active.id === "string") {
          dispatch(
            updateElementInstance({
              id: active.id,
              updates: { config: { position: newPosition } },
            })
          );
        } else {
          console.error("Expected string id, but got:", active.id);
        }
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

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges, customModifier]}
    >
      <CanvasAreaContainer>
        <SiteContainer
          width={currentLayoutSettings.siteWidth}
          height={currentLayoutSettings.canvasHeight}
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
                onUpdate={(updates) => handleElementUpdate(element.id, updates)}
                onDelete={() => deleteElement(element.id)}
                isSelected={element.id === selectedId}
                onMouseUp={() => handleElementMouseUp(element.id)}
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
              onMouseUp={() => handleElementMouseUp(element.id)}
            />
          ))}
        </SiteContainer>
      </CanvasAreaContainer>
    </DndContext>
  );
};
