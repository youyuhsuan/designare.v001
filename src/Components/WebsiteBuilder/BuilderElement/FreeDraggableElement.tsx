"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";
import Image from "next/image";
import { ContentProps, FreeDraggableElementProps } from "../BuilderInterface";
import { useElementContext } from "../Slider/ElementContext";

const ElementWrapper = styled.div<ContentProps>`
  position: absolute;
  user-select: none;
  color: ${(props) => props.$config.color};
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
`;

const EditInput = styled.input<ContentProps>`
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  font-size: ${(props) => props.$config.fontSize || 16};
  font-family: ${(props) => props.$config.fontFamily};
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
  config,
  type,
  isLayout,
  onUpdate,
  onDelete,
  isSelected,
  onClick,
}) => {
  const { updateSelectedElement } = useElementContext();
  const [localPosition, setLocalPosition] = useState(config.position);
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content as string);
  const isDraggingRef = useRef(false);
  const elementRef = useRef<HTMLInputElement>(null);
  // console.log("config.position", config.position);

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
      setLocalPosition(config.position.y);
    }
  }, [config.position.y, isDragging]);

  useEffect(() => {
    if (isDragging && transform) {
      setLocalPosition({
        x: config.position.x + (transform.x ?? 0),
        y: config.position.y + (transform.y ?? 0),
      });
    }
  }, [transform, config.position, isDragging]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (type === "text" || type === "button") {
      console.log("handleDoubleClick");
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate({ content: editableContent });
  };

  useEffect(() => {
    if (isEditing && elementRef.current) {
      elementRef.current.focus();
    }
  }, [isEditing]);

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

  const style = {
    height: `${config.height}px`,
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
          ref={elementRef}
          value={editableContent}
          $config={config}
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
      case "text":
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
      const startHeight = config.height;

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
    [config.height, onUpdate]
  );

  return (
    <ElementWrapper
      ref={setNodeRef}
      style={style}
      $config={config}
      $isDragging={isDragging}
      isSelected={isSelected}
      onClick={onClick}
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
