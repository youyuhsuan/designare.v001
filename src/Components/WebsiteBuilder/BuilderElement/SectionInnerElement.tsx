"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";

interface SectionInnerElementProps {
  id: string;
  content: React.ReactNode;
  onDelete: (id: string) => void;
}

const StyledElement = styled.div<{ isDragging: boolean }>`
  padding: 10px;
  margin: 5px 0;
  background-color: ${(props) => (props.isDragging ? "#f0f0f0" : "white")};
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: move;
  transition: background-color 0.2s ease;
  position: relative;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${StyledElement}:hover & {
    opacity: 1;
  }
`;

export const SectionInnerElement: React.FC<SectionInnerElementProps> = ({
  id,
  content,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    // 添加一個小延遲，讓用戶有機會看到刪除動畫
    setTimeout(() => {
      onDelete(id);
    }, 300);
  };

  return (
    <StyledElement
      ref={setNodeRef}
      style={{
        ...style,
        opacity: isDeleting ? 0 : 1,
        transition: isDeleting ? "opacity 0.3s ease" : transition,
      }}
      isDragging={isDragging}
      {...attributes}
      {...listeners}
    >
      {content}
      <DeleteButton onClick={handleDelete} aria-label="Delete element">
        ×
      </DeleteButton>
    </StyledElement>
  );
};
