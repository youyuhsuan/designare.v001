"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";
import Image from "next/image";

interface FreeDraggableElementProps {
  id: string;
  content: string | React.ReactNode;
  height: number;
  position: { x: number; y: number };
  type: string;
  isLayout: boolean;
  onUpdate: (updates: Partial<FreeDraggableElementProps>) => void;
  onDelete: () => void;
}

const ElementWrapper = styled.div<{ $isDragging: boolean; $isLayout: boolean }>`
  position: absolute;
  user-select: none;
  cursor: ${(props) => (props.$isLayout ? "default" : "move")};
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
  /* Add other styles as needed */
`;

const EditInput = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  padding: 0;
  margin: 0;
`;

const ResizeHandle = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  cursor: se-resize;
  background-color: #007bff;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ff4136;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
`;

const FreeDraggableElement: React.FC<FreeDraggableElementProps> = ({
  id,
  content,
  height,
  position = { x: 0, y: 0 },
  type,
  isLayout,
  onUpdate,
  onDelete,
}) => {
  const [localPosition, setLocalPosition] = useState(position);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content as string);
  const isDraggingRef = useRef(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { type },
    });

  useEffect(() => {
    if (!isDragging && isDraggingRef.current) {
      isDraggingRef.current = false;
      onUpdate({ position: localPosition });
    } else if (isDragging) {
      isDraggingRef.current = true;
    }
  }, [isDragging, localPosition, onUpdate]);

  useEffect(() => {
    if (!isDragging) {
      setLocalPosition(position);
    }
  }, [position, isDragging]);

  useEffect(() => {
    if (isDragging && transform) {
      setLocalPosition({
        x: position.x + (transform.x ?? 0),
        y: position.y + (transform.y ?? 0),
      });
    }
  }, [transform, position, isDragging]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (type === "text" || type === "button") {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate({ content: editableContent });
  };

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const style = {
    height: `${height}px`,
    transform: CSS.Transform.toString({
      x: localPosition.x,
      y: localPosition.y,
      scaleX: 1,
      scaleY: 1,
    }),
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <EditInput
          ref={editInputRef}
          value={editableContent}
          onChange={(e) => setEditableContent(e.target.value)}
          onBlur={handleBlur}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleBlur();
            }
          }}
        />
      );
    }

    switch (type) {
      case "textElement":
        return <p>{content}</p>;
      case "image":
        return (
          <Image
            src={content as string}
            alt="Draggable"
            layout="fill"
            objectFit="contain"
          />
        );
      case "button":
        return <button>{content}</button>;
      case "columns":
      case "container":
      case "list":
      default:
        return <div>{content}</div>;
    }
  };

  const handleResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startY = e.clientY;
      const startHeight = height;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaHeight = moveEvent.clientY - startY;
        const newHeight = Math.max(50, startHeight + deltaHeight);
        onUpdate({ height: newHeight });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [height, onUpdate]
  );

  return (
    <ElementWrapper
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      $isLayout={isLayout}
      onDoubleClick={handleDoubleClick}
      {...(isLayout ? {} : { ...attributes, ...listeners })}
    >
      {renderContent()}
      {!isLayout && (
        <>
          <ResizeHandle onMouseDown={handleResize} />
        </>
      )}
    </ElementWrapper>
  );
};

export default FreeDraggableElement;
