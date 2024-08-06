"use client";

import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/src/libs/store";
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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SiteContainer } from "@/src/Components/WebsiteBuilder/SiteContainer";
import { Layout } from "@/src/Components/WebsiteBuilder/BuilderElement/Layout";
import {
  resizeElement,
  reorderElements,
  addElement,
} from "@/src/libs/features/websiteBuilder/websiteBuilderSlice";

const AddSectionButton: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const handleAddSection = useCallback(() => {
    const newElement = {
      id: `element-${Date.now()}`,
      type: "section",
      content: "選擇格線版面配置，新增元件或精心設計的區段",
      height: 200,
    };
    dispatch(addElement(newElement));
  }, [dispatch]);

  return (
    <button
      onClick={handleAddSection}
      className="bg-blue-500 text-white px-4 py-2 rounded-full mb-4"
    >
      + 新增區段
    </button>
  );
};

export const WebsiteBuilder: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const elements = useSelector(
    (state: RootState) => state.websiteBuilder.elements
  );
  const siteWidth = useSelector(
    (state: RootState) => state.websiteBuilder.siteWidth
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = elements.findIndex((item) => item.id === active.id);
        const newIndex = elements.findIndex((item) => item.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          dispatch(reorderElements({ oldIndex, newIndex }));
        }
      }
    },
    [elements, dispatch]
  );

  const handleResize = useCallback(
    (id: string, height: number) => {
      dispatch(resizeElement({ id, height }));
    },
    [dispatch]
  );

  return (
    <div className="flex flex-col items-center">
      <AddSectionButton />
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
    </div>
  );
};
