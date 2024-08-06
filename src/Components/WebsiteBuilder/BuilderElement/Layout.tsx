"use client";

import React from "react";
import styled from "styled-components";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SectionWrapper = styled.div<{ $isDragging: boolean }>`
  margin-bottom: 10px;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isDragging ? "scale(1.02)" : "scale(1)")};
`;

const Section = styled.div`
  width: 100%;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
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
  justify-content: center;
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
}

export const Layout: React.FC<LayoutProps> = ({
  id,
  content,
  height,
  onResize,
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

  return (
    <SectionWrapper ref={setNodeRef} style={style} $isDragging={isDragging}>
      <Section>
        <DragHandle {...attributes} {...listeners} />
        <SectionContent style={{ height }}>{content}</SectionContent>
        <ResizeHandle
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
        />
      </Section>
    </SectionWrapper>
  );
};
