"use client";

import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSelector } from "react-redux";
import { useElementContext, useElementsDebug } from "./Slider/ElementContext";
import { SiteContainer } from "@/src/Components/WebsiteBuilder/SiteContainer";
import {
  GlobalState,
  LocalElementType,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import LayoutElement from "./BuilderElement/LayoutElement";
import FreeDraggableElement from "./BuilderElement/FreeDraggableElement";
import { useEffect, useState } from "react";
import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { UniqueIdentifier } from "@dnd-kit/core";

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

  const siteWidth = useSelector((state: GlobalState) => state.siteWidth);
  const canvasHeight = useSelector((state: GlobalState) => state.canvasHeight);

  const {
    elements,
    updateElementPosition,
    updateElement,
    deleteElement,
    reorderElement: reorderElements,
  } = useElementContext();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  useElementsDebug(); // 輸出 elements

  // 類型檢查
  if (!Array.isArray(elements)) {
    console.error("elements is not an array:", elements);
    return null;
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("handleDragEnd");
    const { active, over, delta } = event;

    console.log("Active:", active);
    console.log("Over:", over);

    if (!active) {
      console.error("Invalid 'active' data:", active);
      return;
    }

    // 查找活动元素
    const activeElement = elements.find((el) => el.id === active.id);

    if (!activeElement) {
      console.warn("Active element not found");
      return;
    }

    if (over) {
      // 如果有 over 对象，说明拖动到了可放置的区域
      if (!activeElement.isLayout) {
        reorderElements(active.id, over.id);
      } else if (typeof over.x === "number" && typeof over.y === "number") {
        updateElementPosition(active.id, { x: over.x, y: over.y });
      }
    } else {
      // 如果没有 over 对象，说明拖动到了非可放置区域
      if (activeElement.isLayout && delta) {
        const newPosition = {
          x: (activeElement.position?.x || 0) + delta.x,
          y: (activeElement.position?.y || 0) + delta.y,
        };
        updateElementPosition(active.id, newPosition);
      }
    }

    // 重置活动 ID
    setActiveId(null);
  };

  const handleElementUpdate = (
    id: string,
    updates: Partial<LocalElementType>
  ) => {
    console.log("handleElementUpdate called", id, updates);
    updateElement(id, updates);
  };

  const layoutElements = elements.filter((el) => el.isLayout);
  const freeDraggableElements = elements.filter((el) => !el.isLayout);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="canvas-area">
        <SiteContainer width={siteWidth} height={canvasHeight}>
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
              />
            ))}
          </SortableContext>

          {freeDraggableElements.map((element) => (
            <FreeDraggableElement
              key={element.id}
              {...element}
              onUpdate={(updates) => handleElementUpdate(element.id, updates)}
              onDelete={() => deleteElement(element.id)}
            />
          ))}
        </SiteContainer>
      </div>
    </DndContext>
  );
};
