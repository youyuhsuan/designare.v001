"use client";

import React, { useEffect, useRef } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";
import {
  useElementContext,
  updateElementPosition,
  resizeElement,
  deleteElement,
} from "../Slider/ElementContext";
import Image from "next/image";

interface FreeDraggableElementProps {
  id: string;
  content: React.ReactNode;
  height: number;
  position: { x: number; y: number };
  type: string;
  isLayout: boolean;
}

const ElementWrapper = styled.div<{ $isDragging: boolean; $isLayout: boolean }>`
  position: absolute;
  user-select: none;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isDragging ? "scale(1.02)" : "scale(1)")};
  pointer-events: ${(props) => (props.$isLayout ? "none" : "auto")};
`;

const FreeDraggableElement: React.FC<FreeDraggableElementProps> = ({
  id,
  content,
  height,
  position,
  type,
  isLayout,
}) => {
  const { dispatch } = useElementContext();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, data: { type } });

  const prevTransformRef = useRef(transform);

  useEffect(() => {
    if (
      !isLayout &&
      transform &&
      (transform.x !== prevTransformRef.current?.x ||
        transform.y !== prevTransformRef.current?.y)
    ) {
      const newPosition = {
        x: position.x + transform.x,
        y: position.y + transform.y,
      };
      dispatch(updateElementPosition(id, newPosition.x, newPosition.y));
    }
    prevTransformRef.current = transform;
  }, [transform, position, dispatch, id, isLayout]);

  const style = {
    transform: CSS.Translate.toString(transform),
    height: `${height}px`,
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  const renderContent = () => {
    switch (type) {
      case "text":
        return <p>{content}</p>;
      case "image":
        return (
          <Image
            src={content as string} // Ensure content is of type string or StaticImport
            alt="Draggable"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        );
      case "button":
        return <button>{content}</button>;
      case "columns":
        return <div>{content}</div>; // You may want to implement a more complex column layout
      case "container":
        return <div>{content}</div>;
      case "list":
        return (
          <ul>
            <li>{content}</li>
          </ul>
        ); // You may want to implement a more complex list
      default:
        return <div>{content}</div>;
    }
  };

  const handleResize = (newHeight: number) => {
    dispatch(resizeElement(id, newHeight, isLayout));
  };

  const handleDelete = () => {
    dispatch(deleteElement(id, isLayout));
  };

  return (
    <ElementWrapper
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      $isLayout={isLayout}
      {...(isLayout ? {} : { ...attributes, ...listeners })}
    >
      {content}
      {!isLayout && (
        <>
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              const startY = e.clientY;
              const startHeight = height;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const newHeight = startHeight + moveEvent.clientY - startY;
                handleResize(Math.max(50, newHeight));
              };

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
          >
            Resize
          </div>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </ElementWrapper>
  );
};

export default FreeDraggableElement;
