"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LayoutProps {
  id: string;
  content: React.ReactNode;
  height: number;
  onResize: (id: string, height: number) => void;
  onDelete: (id: string) => void;
  type?: string;
}

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

export const Layout: React.FC<LayoutProps> = ({
  id,
  content,
  height,
  onResize,
  onDelete,
  type = "section",
}) => {
  const [isHandleVisible, setIsHandleVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

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
    console.log(handleClickOutside, handleKeyDown);

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
          />
        )}
        <SectionContent style={{ height }}>{content}</SectionContent>
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
