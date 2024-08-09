import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";
import {
  FreeDraggableElementData,
  updateFreeDraggableElementPosition,
  resizeElement,
  deleteElement,
} from "@/src/libs/features/websiteBuilder/websiteBuilderSlice";

interface FreeDraggableElementProps
  extends Omit<FreeDraggableElementData, "content"> {
  content: React.ReactNode;
  onResize: (id: string, height: number) => void;
  onDelete: (id: string) => void;
}

const ElementWrapper = styled.div<{ $isDragging: boolean }>`
  position: absolute;
  user-select: none;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isDragging ? "scale(1.02)" : "scale(1)")};
`;

// Component - FreeDraggableElement
const FreeDraggableElement: React.FC<FreeDraggableElementProps> = ({
  id,
  content,
  height,
  position,
  type,
}) => {
  const dispatch = useDispatch();
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, data: { type } });

  const prevTransformRef = useRef(transform);

  useEffect(() => {
    if (
      transform &&
      (transform.x !== prevTransformRef.current?.x ||
        transform.y !== prevTransformRef.current?.y)
    ) {
      const newPosition = {
        x: position.x + transform.x,
        y: position.y + transform.y,
      };
      dispatch(
        updateFreeDraggableElementPosition({ id, position: newPosition })
      );
    }
    prevTransformRef.current = transform;
  }, [transform, position, dispatch, id]);

  const style = {
    transform: CSS.Translate.toString(transform),
    height: `${height}px`,
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  const handleResize = (newHeight: number) => {
    dispatch(resizeElement({ id, height: newHeight, isLayout: false }));
  };

  const handleDelete = () => {
    dispatch(deleteElement({ id, isLayout: false }));
  };

  return (
    <ElementWrapper
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      {...attributes}
      {...listeners}
    >
      {content}
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
    </ElementWrapper>
  );
};

export default FreeDraggableElement;
