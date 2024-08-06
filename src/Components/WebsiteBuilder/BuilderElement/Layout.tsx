"use client";

import React from "react";
import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SectionWrapper = styled.section<{ $isDragging: boolean }>`
  margin-bottom: 10px;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isDragging ? "scale(1.02)" : "scale(1)")};
`;

const Section = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 4px;
`;

const SectionContent = styled.div`
  padding: 20px;
  min-height: 100px;
`;

const DragHandle = styled.div`
  height: 20px;
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

interface LayoutProps {
  id: string;
  content: React.ReactNode;
  height: number;
  onResize: (id: string, height: number) => void;
  type?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  id,
  content,
  height,
  onResize,
  type = "section",
}) => {
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

  const ContentWrapper = type === "header" ? styled.header`` : SectionContent;

  return (
    <SectionWrapper
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      role="region"
      aria-label={`${type} content`}
    >
      <Section>
        <DragHandle
          {...attributes}
          {...listeners}
          role="button"
          aria-label="Drag to reorder"
          tabIndex={0}
        />
        <ContentWrapper style={{ height }}>{content}</ContentWrapper>
        <ResizeHandle
          role="slider"
          aria-label="Resize section"
          aria-valuemin={100}
          aria-valuemax={1000}
          aria-valuenow={height}
          tabIndex={0}
          onMouseDown={(e) => {
            e.preventDefault();
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
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
              const delta = e.key === "ArrowUp" ? -10 : 10;
              onResize(id, Math.max(100, height + delta));
            }
          }}
        />
      </Section>
    </SectionWrapper>
  );
};
