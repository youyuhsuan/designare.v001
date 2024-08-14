"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";
import Image from "next/image";
import { FreeDraggableElementProps } from "../BuilderInterface";

const ElementWrapper = styled.div<{ $isDragging: boolean; $isLayout: boolean }>`
  position: absolute;
  user-select: none;
  transition: transform 0.2s ease;
  transform: ${(props) => (props.$isDragging ? "scale(1.02)" : "scale(1)")};
  pointer-events: ${(props) => (props.$isLayout ? "none" : "auto")};
  border: solid 1px;
  will-change: transform;
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
  const isDraggingRef = useRef(false); // 記錄元素是否正在被拖拽

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { type }, // 附加到拖拽事件中的數據
    });

  // 拖拽設定
  useEffect(() => {
    if (!isDragging && isDraggingRef.current) {
      // Dragging has ended
      isDraggingRef.current = false;
      onUpdate({ position: localPosition });
    } else if (isDragging) {
      isDraggingRef.current = true;
    }
  }, [isDragging, localPosition, onUpdate]);

  // 拖拽結束處理
  useEffect(() => {
    if (!isDragging) {
      setLocalPosition(position);
    }
  }, [position, isDragging]);

  // 拖拽位置計算
  useEffect(() => {
    if (isDragging && transform) {
      setLocalPosition({
        x: position.x + (transform.x ?? 0),
        y: position.y + (transform.y ?? 0),
      });
    }
  }, [transform, position, isDragging]);

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
    switch (type) {
      case "text":
        return <p>{content}</p>;
      case "image":
        return (
          <Image
            src={content as string}
            alt="Draggable"
            style={{ maxWidth: "100%", height: "auto" }}
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
    (newHeight: number) => {
      onUpdate?.({ height: Math.max(50, newHeight) });
    },
    [onUpdate]
  );

  return (
    <ElementWrapper
      ref={setNodeRef} // 元素可被拖拽
      style={style}
      $isDragging={isDragging} // 元素是否正在被拖拽
      $isLayout={isLayout} // 是否布局模式
      {...(isLayout ? {} : { ...attributes, ...listeners })}
    >
      {renderContent()}
      {!isLayout && (
        <>
          <div
            onMouseDown={(e) => {
              // Resize 處理
              e.preventDefault();
              const startY = e.clientY;
              const startHeight = height;

              const handleMouseMove = (moveEvent: MouseEvent) => {
                const deltaHeight = moveEvent.clientY - startY;
                const newHeight = startHeight + deltaHeight;
                handleResize(newHeight);
              };

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
          ></div>
          <button onClick={onDelete}>Delete</button>
        </>
      )}
    </ElementWrapper>
  );
};

export default FreeDraggableElement;
