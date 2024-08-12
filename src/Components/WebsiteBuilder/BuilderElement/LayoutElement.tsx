"use client";

import React, { useCallback, useRef, useEffect } from "react";
import {
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";
import { useElementContext } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import { SectionInnerElement } from "@/src/Components/WebsiteBuilder/BuilderElement/SectionInnerElement";
import { LayoutElementProps } from "../BuilderInterface";

const SectionWrapper = styled.div<{ $isDragging: boolean }>`
  margin-bottom: 10px;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isDragging ? "scale(1.02)" : "scale(1)")};
`;

const Section = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
`;

const SectionContent = styled.div`
  padding: 20px;
  min-height: 100px;
`;

const DragHandle = styled.div`
  height: 20px;
  padding: 5px;
  background-color: ${(props) => props.theme.colors.background};
  cursor: move;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &::before {
    content: "⋮⋮";
    color: ${(props) => props.theme.colors.primary};
  }
`;

const ResizeHandle = styled.div`
  width: 100%;
  height: 10px;
  background-color: ${(props) => props.theme.colors.background};
  cursor: row-resize;
`;

const LayoutElement: React.FC<LayoutElementProps> = ({
  id,
  content,
  height,
  type,
  isLayout,
  onUpdate,
  onDelete,
}) => {
  const [isHandleVisible, setIsHandleVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleHandle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHandleVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        setIsHandleVisible(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Backspace" &&
        document.activeElement === elementRef.current
      ) {
        event.preventDefault();
        event.stopPropagation();
        onDelete(id);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [id, onDelete]);

  const handleResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startY = e.clientY;
      const startHeight = height;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaY = e.clientY - startY;
        onResize(id, Math.max(100, startHeight + deltaY));
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [id, height, onResize]
  );

  const handleKeyResize = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const delta = e.key === "ArrowUp" ? -10 : 10;
        onResize(id, Math.max(100, height + delta));
      }
    },
    [id, height, onResize]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const sectionIndex = sections.findIndex((section) =>
        section.elements.some((element) => element.id === active.id)
      );
      if (sectionIndex !== -1) {
        const section = sections[sectionIndex];
        const oldIndex = section.elements.findIndex(
          (element) => element.id === active.id
        );
        const newIndex = section.elements.findIndex(
          (element) => element.id === over?.id
        );
        reorderElementsInSection(section.id, oldIndex, newIndex);
      }
    }
  };

  return (
    <SectionWrapper
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      role="region"
      aria-label={`${type} content`}
      onClick={toggleHandle}
    >
      <Section ref={elementRef} tabIndex={0}>
        {isHandleVisible && (
          <DragHandle
            {...attributes}
            {...listeners}
            role="button"
            aria-label="Drag to reorder"
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
          >
            Drag
          </DragHandle>
        )}
        <SectionContent style={{ height }}>
          {content}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {sections.map((section) => (
              <SortableContext
                key={section.id}
                items={section.elements.map((e) => e.id)}
                strategy={verticalListSortingStrategy}
              >
                {section.elements.map((element) => (
                  <SectionInnerElement
                    key={element.id}
                    id={element.id}
                    content={
                      element.type === "slider"
                        ? `Slider with ${element.slides.length} slides`
                        : `Element: ${element.name}`
                    }
                    onDelete={() =>
                      deleteElementFromSection(section.id, element.id)
                    }
                  />
                ))}
              </SortableContext>
            ))}
          </DndContext>
        </SectionContent>
        <ResizeHandle
          role="slider"
          aria-label="Resize section"
          aria-valuemin={100}
          aria-valuemax={1000}
          aria-valuenow={height}
          tabIndex={0}
          onMouseDown={handleResize}
          onKeyDown={handleKeyResize}
        />
      </Section>
    </SectionWrapper>
  );
};

export default Layout;
