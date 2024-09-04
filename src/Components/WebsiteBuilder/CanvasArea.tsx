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
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { throttle } from "lodash";

import { useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useElementContext } from "./Slider/ElementContext";

import { SiteContainer } from "@/src/Components/WebsiteBuilder/SiteContainer";
import LayoutElement from "./BuilderElement/LayoutElement";
import FreeDraggableElement from "./BuilderElement/FreeDraggableElement";

import {
  FreeDraggableElementData,
  LayoutElementData,
  LocalElementType,
  Position,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";

import styled from "styled-components";

import { customModifier } from "@/src/utilities/customModifier";
import { useAppDispatch, useAppSelector } from "@/src/libs/hook";
import { setLayoutSettings } from "@/src/libs/features/websiteBuilder/globalSettingsSlice";
import { updateElementInstance } from "@/src/libs/features/websiteBuilder/elementLibrarySlice";
import { selectElementsArray } from "@/src/libs/features/websiteBuilder/elementLibrarySelector";
import { fetchElementLibrary } from "@/src/libs/features/websiteBuilder/websiteMetadataThunk";
import isEqual from "lodash/isEqual";
import {
  selectCanvasOffset,
  selectCurrentDevice,
  selectCurrentLayoutSettings,
} from "@/src/libs/features/websiteBuilder/globalSelect";

const CanvasAreaContainer = styled.div`
  width: 100%;
`;

export interface Size {
  width: number;
  height: number;
}

interface ElementConfig {
  position: Position;
  size: Size;
  horizontalAlignment?: AlignmentConfig;
  verticalAlignment?: AlignmentConfig;
  style?: React.CSSProperties;
}

interface ElementType {
  id: string;
  config: ElementConfig;
  isLayout: boolean;
}

interface CanvasAreaProps {
  id?: string;
}

export type AlignmentConfig = {
  horizontalAlignment?:
    | { left?: number }
    | { center?: number }
    | { right?: number }
    | null;
  verticalAlignment?:
    | { top?: number }
    | { center?: number }
    | { bottom?: number }
    | null;
};

export const CanvasArea: React.FC<CanvasAreaProps> = ({ id }) => {
  // 設置拖拽感應器
  const sensors = useSensors(
    useSensor(PointerSensor), // 用於滑鼠拖拽的感應器
    useSensor(KeyboardSensor, {
      // 用於鍵盤拖拽的感應器
      coordinateGetter: sortableKeyboardCoordinates, // 獲取鍵盤拖拽的座標
    })
  );

  const dispatch = useAppDispatch();
  const currentDevice = useSelector(selectCurrentDevice);
  const currentLayoutSettings = useSelector(selectCurrentLayoutSettings); // 當前佈局設置
  const canvasOffset = useAppSelector(selectCanvasOffset); // 畫布的偏移量
  const handleResizeRef =
    useRef<(elementId: string, newSize: Size, direction: string) => void>(); // 用於存儲 resize 處理函數的引用
  // 自定義比較函數，用於比較元素數組的變化
  const customCompare = (prev: any[], next: any[]) => {
    const isEqualResult = isEqual(prev, next); // 使用 lodash 的 isEqual 函數比較數組是否相等
    return isEqualResult;
  };
  const elementArray = useSelector(selectElementsArray, customCompare); // 獲取元素數組，並使用自定義比較函數來避免不必要的重渲染

  // 當元素數組變化時，打印變化的元素數組
  // useEffect(() => {
  //   console.log("Element array changed:", elementArray);
  // }, [elementArray]);

  // 獲取元素上下文中的函數
  const {
    elements,
    updateElementPosition, // 更新元素位置的函數
    updateElement, // 更新元素的函數
    deleteElement, // 刪除元素的函數
    reorderElement: reorderElements, // 重新排序元素的函數
    setSelectedElement, // 設置選中元素的函數
    handleElementSelect, // 設置選中元素及其路徑的函數
  } = useElementContext();

  // 定義狀態鉤子
  const [activeId, setActiveId] = useState<string | number | null>(null); // 當前活動元素的 ID
  const [selectedId, setSelectedId] = useState<string | null>(null); // 當前選中元素的 ID
  const [isDragResizeEnabled, setIsDragResizeEnabled] = useState(true); // 是否啟用拖拽調整大小功能
  const [isAlignmentEnabled, setIsAlignmentEnabled] = useState(false); // 是否啟用對齊功能
  const [alignmentConfig, setAlignmentConfig] = useState({
    horizontalAlignment: null, // 水平對齊配置
    verticalAlignment: null, // 垂直對齊配置
  });

  // 處理元素更新
  const handleElementUpdate = useCallback(
    (id: string, updates: Partial<LocalElementType>) => {
      updateElement(id, updates);
      dispatch(
        updateElementInstance({
          id: id,
          updates: updates,
        })
      );
    },
    [dispatch, updateElement]
  );

  // 載入元素庫
  useEffect(() => {
    dispatch(fetchElementLibrary(id as string));
  }, [dispatch, id]);

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

  const calculateElementPosition = useCallback(
    (element: ElementType) => {
      const { size, position, horizontalAlignment, verticalAlignment } =
        element.config;
      let newPosition = { ...position };
      const canvasWidth = parseInt(currentLayoutSettings.siteWidth);
      const canvasHeight = parseInt(currentLayoutSettings.canvasHeight);
      if (horizontalAlignment) {
        if ("left" in horizontalAlignment) {
          newPosition.x = (horizontalAlignment.left as number) || 0;
        } else if ("center" in horizontalAlignment) {
          newPosition.x =
            (canvasWidth - size.width) / 2 +
            ((horizontalAlignment.center as number) || 0);
        } else if ("right" in horizontalAlignment) {
          newPosition.x =
            canvasWidth -
            size.width -
            ((horizontalAlignment.right as number) || 0);
        }
      }

      if (verticalAlignment) {
        if ("top" in verticalAlignment) {
          newPosition.y = (verticalAlignment.top as number) || 0;
        } else if ("center" in verticalAlignment) {
          newPosition.y =
            (canvasHeight - size.height) / 2 +
            ((verticalAlignment.center as number) || 0);
        } else if ("bottom" in verticalAlignment) {
          newPosition.y =
            canvasHeight -
            size.height -
            ((verticalAlignment.bottom as number) || 0);
        }
      }
      newPosition.x += canvasOffset.x;
      newPosition.y += canvasOffset.y;
      return newPosition;
    },
    [
      canvasOffset.x,
      canvasOffset.y,
      currentLayoutSettings.siteWidth,
      currentLayoutSettings.canvasHeight,
    ]
  );

  const handleAlignmentChange = (
    key: "horizontalAlignment" | "verticalAlignment",
    value: AlignmentConfig | null
  ) => {
    setAlignmentConfig((prev) => ({
      ...prev,
      [key]: value,
    }));

    setIsAlignmentEnabled(value !== null);

    // Recalculate positions for all elements
    elementArray.forEach((element) => {
      const updatedElement = {
        ...element,
        config: {
          ...element.config,
          [key]: value,
        },
      };
      const newPosition = calculateElementPosition(updatedElement);
      dispatch(
        updateElementInstance({
          id: element.id,
          updates: { config: { position: newPosition, [key]: value } },
        })
      );
    });
  };

  const handleResize = useCallback(
    (elementId: string, newSize: Size, direction: string) => {
      if (!isDragResizeEnabled) return;

      const element = elementArray.find((el) => el.id === elementId);
      if (!element) return;

      // 創建一個臨時元素用於位置計算
      const tempElement = {
        ...element,
        config: { ...element.config, size: newSize },
      };

      // 使用當前的對齊配置
      let newPosition = calculateElementPosition(tempElement);

      if (!isAlignmentEnabled) {
        // 如果不啟用對齊，調整位置以保持元素的左上角固定
        if (direction.includes("left")) {
          newPosition.x -= newSize.width - element.config.size.width;
        }
        if (direction.includes("top")) {
          newPosition.y -= newSize.height - element.config.size.height;
        }
      }

      dispatch(
        updateElementInstance({
          id: elementId,
          updates: {
            config: {
              ...element.config,
              size: newSize,
              position: newPosition,
            },
          },
        })
      );
    },
    [
      elementArray,
      dispatch,
      isDragResizeEnabled,
      isAlignmentEnabled,
      calculateElementPosition,
    ]
  );

  useEffect(() => {
    handleResizeRef.current = throttle(handleResize, 16);
  }, [handleResize]);

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
  // useEffect(() => {
  //   console.log("Layout elements:", layoutElements);
  //   console.log("Free draggable elements:", freeDraggableElements);
  // }, [layoutElements, freeDraggableElements]);

  // useElementsDebug(); // 啟用元素調試（如果有的話）

  // 處理元素點擊事件，設定選中的元素
  // const handleElementMouseUp = (id: string) => {
  //   // console.log("Element clicked:", id);
  //   setSelectedId(id);
  //   const selectedElement = elements.find((el) => el.id === id) || null;
  //   // console.log("Selected element:", selectedElement);
  //   setSelectedElement(selectedElement);
  // };

  // const handleCanvasClick = useCallback(
  //   (event: React.MouseEvent<HTMLDivElement>) => {
  //     if (event.target === event.currentTarget) {
  //       console.log("Canvas 空白区域被点击，准备取消选择");
  //       handleElementSelect({ id: null });
  //     }
  //   },
  //   [handleElementSelect]
  // );

  // 處理拖拽開始事件
  const handleDragStart = (event: DragStartEvent) => {
    if (isDragResizeEnabled) {
      setActiveId(event.active.id);
    }
  };

  // 處理拖拽結束事件
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!isDragResizeEnabled) return;
      const { active, over, delta } = event;
      if (!active) {
        console.error("無效的 'active' 數據:", active);
        setActiveId(null);
        return;
      }

      const activeElement = elements.find((el) => el.id === active.id);

      if (!activeElement) {
        setActiveId(null);
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
          let newPosition;
          if (isAlignmentEnabled) {
            newPosition = calculateElementPosition(activeElement);
          } else {
            if (Math.abs(delta.x) > 5 || Math.abs(delta.y) > 5) {
              newPosition = {
                x: (activeElement.config?.position?.x || 0) + delta.x,
                y: (activeElement.config?.position?.y || 0) + delta.y,
              };
            }
          }
          if (newPosition) {
            updateElementPosition(active.id, {
              position: { x: newPosition.x, y: newPosition.y },
            });
            if (typeof active.id === "string") {
              dispatch(
                updateElementInstance({
                  id: active.id,
                  updates: {
                    config: {
                      position: { x: newPosition.x, y: newPosition.y },
                    },
                  },
                })
              );
            } else {
              console.error("Expected string id, but got:", active.id);
            }
          } else {
            console.warn("自由元素的 delta 未定義", active.id);
          }
        }
      }
      setActiveId(null);
    },
    [
      isDragResizeEnabled,
      isAlignmentEnabled,
      elements,
      dispatch,
      updateElementPosition,
      reorderElements,
      calculateElementPosition,
    ]
  );

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
          onClick={() => handleElementSelect({ id: null })}
        >
          <SortableContext
            items={layoutElements.map((el) => el.id)}
            strategy={verticalListSortingStrategy}
          >
            {layoutElements.map((element) => {
              const path = element.path
                ? [...element.path, element.id]
                : [element.id];
              return (
                <LayoutElement
                  key={element.id}
                  {...element}
                  onUpdate={(updates) =>
                    handleElementUpdate(element.id, updates)
                  }
                  onDelete={() => deleteElement(element.id)}
                  isSelected={element.id === selectedId}
                  onSelect={() => {
                    handleElementSelect({ id: element.id, path: path });
                  }}
                  onResize={handleResize}
                />
              );
            })}
          </SortableContext>
          {freeDraggableElements.map((element) => (
            <FreeDraggableElement
              key={element.id}
              {...element}
              onUpdate={(updates) => handleElementUpdate(element.id, updates)}
              onDelete={() => deleteElement(element.id)}
              isSelected={element.id === selectedId}
              onMouseUp={() => handleElementSelect(element)}
              calculatePosition={() => calculateElementPosition(element)}
              alignmentConfig={alignmentConfig}
              handleResize={handleResize}
            />
          ))}
        </SiteContainer>
      </CanvasAreaContainer>
    </DndContext>
  );
};
