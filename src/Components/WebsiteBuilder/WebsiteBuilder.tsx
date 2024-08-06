"use client";

import React, { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SiteContainer } from "@/src/Components/WebsiteBuilder/SiteContainer";
import { Layout } from "@/src/Components/WebsiteBuilder/BuilderElement/Layout";

interface ElementData {
  id: string;
  content: React.ReactNode;
  height: number;
}

export const WebsiteBuilder: React.FC = () => {
  const [elements, setElements] = useState<ElementData[]>([
    { id: "header", content: <h1>網站標題</h1>, height: 100 },
    { id: "paragraph", content: <p>這是一個段落。</p>, height: 100 },
  ]);

  const [siteWidth, setSiteWidth] = useState("1200px");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setElements((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleResize = useCallback((id: string, height: number) => {
    setElements((prev) =>
      prev.map((element) =>
        element.id === id ? { ...element, height } : element
      )
    );
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SiteContainer width={siteWidth}>
        <SortableContext
          items={elements.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          {elements.map((element) => (
            <Layout
              key={element.id}
              id={element.id}
              content={element.content}
              height={element.height}
              onResize={handleResize}
            />
          ))}
        </SortableContext>
      </SiteContainer>
    </DndContext>
  );
};
