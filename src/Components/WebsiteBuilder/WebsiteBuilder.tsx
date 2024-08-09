// 整合 Redux 和 React Context
"use client";

import React, { useCallback, useState, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SiteContainer } from "@/src/Components/WebsiteBuilder/SiteContainer";
import Layout from "@/src/Components/WebsiteBuilder/BuilderElement/Layout";
import FreeDraggableElement from "@/src/Components/WebsiteBuilder/BuilderElement/FreeDraggableElement";
import {
  resizeElement,
  updateFreeDraggableElementPosition,
  reorderLayoutElements,
  addLayoutElement,
  addFreeDraggableElement,
  deleteElement,
  setSiteWidth,
} from "@/src/libs/features/websiteBuilder/websiteBuilderSlice";
import { Button } from "@/src/Components/Button";
import { BuilderProvider } from "@/src/Components/WebsiteBuilder/BuilderProvider";

// Type definitions
interface Position {
  x: number;
  y: number;
}

interface BaseElementData {
  id: string;
  type: string;
  content: string;
  height: number;
}

interface LayoutElementData extends BaseElementData {
  isLayout: true;
}

interface FreeDraggableElementData extends BaseElementData {
  isLayout: false;
  position: Position;
}

type ElementData = LayoutElementData | FreeDraggableElementData;

interface WebsiteBuilderState {
  layoutElements: LayoutElementData[];
  freeDraggableElements: FreeDraggableElementData[];
  siteWidth: string;
}

interface RootState {
  websiteBuilder: WebsiteBuilderState;
}

interface SiteContainerProps {
  width: string;
  children: ReactNode;
}

interface LayoutProps extends LayoutElementData {
  onResize: (height: number | string) => void;
  onDelete: () => void;
}

interface FreeDraggableElementProps extends FreeDraggableElementData {
  onResize: (height: number | string) => void;
  onDelete: () => void;
}

// Component implementations
const AddSectionButton: React.FC = () => {
  const dispatch = useDispatch();

  const handleAddSection = useCallback(() => {
    const newElement: LayoutElementData = {
      id: `layout-${Date.now()}`,
      type: "section",
      content: "選擇格線版面配置，新增元件或精心設計的區段",
      height: 200,
      isLayout: true,
    };
    dispatch(addLayoutElement(newElement));
  }, [dispatch]);

  return <Button onClick={handleAddSection}>+ 新增區段</Button>;
};

export const WebsiteBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const layoutElements = useSelector<RootState, LayoutElementData[]>(
    (state) => state.websiteBuilder.layoutElements
  );
  const freeDraggableElements = useSelector<
    RootState,
    FreeDraggableElementData[]
  >((state) => state.websiteBuilder.freeDraggableElements);
  const siteWidth = useSelector<RootState, string>(
    (state) => state.websiteBuilder.siteWidth
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      if (active.data.current?.isLayout) {
        const oldIndex = layoutElements.findIndex(
          (item) => item.id === active.id
        );
        const newIndex = layoutElements.findIndex(
          (item) => item.id === over.id
        );
        if (oldIndex !== -1 && newIndex !== -1) {
          dispatch(reorderLayoutElements({ oldIndex, newIndex }));
        }
      } else {
        dispatch(
          updateFreeDraggableElementPosition({
            id: active.id as string,
            position: {
              x: over.rect.left - over.rect.width / 2,
              y: over.rect.top - over.rect.height / 2,
            },
          })
        );
      }
    }
    setActiveId(null);
  };

  const handleResize = useCallback(
    (id: string, height: number | string, isLayout: boolean) => {
      const numericHeight =
        typeof height === "string" ? parseInt(height, 10) : height;
      if (!isNaN(numericHeight)) {
        dispatch(resizeElement({ id, height: numericHeight, isLayout }));
      }
    },
    [dispatch]
  );

  const handleDeleteElement = useCallback(
    (id: string, isLayout: boolean) => {
      dispatch(deleteElement({ id, isLayout }));
    },
    [dispatch]
  );

  return (
    <BuilderProvider>
      {/* <AddSectionButton /> */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SiteContainer width={siteWidth}>
          <SortableContext
            items={layoutElements.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            {layoutElements.map((element) => (
              <Layout
                key={element.id}
                {...element}
                onResize={(height) => handleResize(element.id, height, true)}
                onDelete={() => handleDeleteElement(element.id, true)}
              />
            ))}
          </SortableContext>
          {freeDraggableElements.map((element) => (
            <FreeDraggableElement
              key={element.id}
              {...element}
              onResize={(height) => handleResize(element.id, height, false)}
              onDelete={() => handleDeleteElement(element.id, false)}
            />
          ))}
        </SiteContainer>
        <DragOverlay>
          {activeId ? (
            layoutElements.find((el) => el.id === activeId) ? (
              <Layout
                {...(layoutElements.find(
                  (el) => el.id === activeId
                ) as LayoutElementData)}
                onResize={() => {}}
                onDelete={() => {}}
              />
            ) : (
              <FreeDraggableElement
                {...(freeDraggableElements.find(
                  (el) => el.id === activeId
                ) as FreeDraggableElementData)}
                onResize={() => {}}
                onDelete={() => {}}
              />
            )
          ) : null}
        </DragOverlay>
      </DndContext>
    </BuilderProvider>
  );
};
