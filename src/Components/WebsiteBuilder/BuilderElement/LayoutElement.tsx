"use client";

import React, { useCallback, useRef, useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";
import { LayoutElementProps, SectionWrapperProps } from "../BuilderInterface";

const SectionWrapper = styled.div<{
  $isDragging?: boolean;
  isSelected?: boolean;
}>`
  min-height: 100px;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isDragging ? "scale(1.02)" : "scale(1)")};
`;

const Section = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: ${(props) => props.theme.borderRadius.sm};
`;

const SectionContent = styled.div`
  padding: 20px;
  height: 100%;
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

const ResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
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
  onUpdate,
  onDelete,
  isSelected,
  onClick,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [elementHeight, setElementHeight] = useState(height);

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
      isLayout: true, // 添加這個屬性
    },
  });

  useEffect(() => {
    setElementHeight(height);
  }, [height]);

  const style: React.CSSProperties = {
    height: `${elementHeight}px`,
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Backspace" &&
        document.activeElement === elementRef.current
      ) {
        event.preventDefault();
        event.stopPropagation();
        onDelete();
        console.log(`Element ${id} - Deleted`);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [id, onDelete]);

  const handleResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startY = e.clientY;
      const startHeight = elementHeight;

      console.log(
        `Element ${id} - Resize started, initial height: ${startHeight}px`
      );

      const handleMouseMove = (e: MouseEvent) => {
        const deltaY = e.clientY - startY;
        const newHeight = Math.max(100, startHeight + deltaY);
        setElementHeight(newHeight);
        onUpdate({ height: newHeight });
        console.log(`Element ${id} - Resizing, new height: ${newHeight}px`);
      };

      const handleMouseUp = () => {
        console.log(
          `Element ${id} - Resize ended, final height: ${elementHeight}px`
        );
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [id, elementHeight, onUpdate]
  );

  const handleKeyResize = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const delta = e.key === "ArrowUp" ? -10 : 10;
        const newHeight = Math.max(100, elementHeight + delta);
        setElementHeight(newHeight);
        onUpdate({ height: newHeight });
        console.log(
          `Element ${id} - Arrow key resize, new height: ${newHeight}px`
        );
      }
    },
    [id, elementHeight, onUpdate]
  );

  return (
    <SectionWrapper
      ref={setNodeRef}
      style={style}
      role="region"
      aria-label={`${type} content`}
      $isDragging={isDragging}
      isSelected={isSelected}
      onClick={onClick}
    >
      <Section ref={elementRef} tabIndex={0}>
        {isSelected && (
          <DragHandle
            {...attributes}
            {...listeners}
            role="button"
            aria-label="Drag to reorder vertically"
            tabIndex={0}
          />
        )}
        <SectionContent>{content}</SectionContent>
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
      </Section>
    </SectionWrapper>
  );
};

export default LayoutElement;
