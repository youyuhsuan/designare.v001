"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import styled from "styled-components";
import { ContentProps, FreeDraggableElementProps } from "../BuilderInterface";
import { useElementContext } from "../Slider/ElementContext";
import ResizeHandles from "./handleResize";
import EditInput from "./EditInput";
import {
  ButtonElement,
  PElement,
  ImageWrapperElement,
  ImageElement,
} from "./Styles";

const ElementWrapper = styled.div<ContentProps>`
  position: absolute;
  cursor: move;
  user-select: none;
  object-fit: ${(props) => props.$config?.objectFit};
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
  border: 1px solid
    ${(props) => (props.$isSelected ? props.theme.colors.accent : "none")};
  width: ${(props) => props.$config?.size?.width}px;
  height: ${(props) => props.$config?.size?.height}px;
`;

const FreeDraggableElement: React.FC<FreeDraggableElementProps> = ({
  id,
  content,
  config,
  type,
  calculatePosition,
  alignmentConfig,
  isLayout,
  onUpdate,
  onDelete,
  isSelected,
  onMouseUp: parentOnMouseUp,
  handleResize: parentHandleResize,
}) => {
  // 使用上下文來更新選中的元素
  const { updateSelectedElement } = useElementContext();

  // 狀態：編輯模式和內容
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content as string);
  const [isElementSelected, setIsElementSelected] = useState(isSelected);
  const [interactionMode, setInteractionMode] = useState<
    "none" | "dragging" | "resizing" | "edi"
  >("none");
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 0, height: 0 });
  const resizeDirectionRef = useRef<string | null>(null);

  const elementRef = useRef<
    HTMLInputElement | HTMLButtonElement | HTMLParagraphElement | null
  >(null);

  const [shouldSelectAll, setShouldSelectAll] = useState(false);
  const isFirstEditRef = useRef(true);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { type },
    });

  const style = React.useMemo(() => {
    const position = calculatePosition({ id, config }, alignmentConfig);
    const baseStyle = {
      position: "absolute" as const,
      transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      transition: isDragging ? "none" : "transform 0.3s ease-out",
      width: `${config.size.width}px`,
      height: `${config.size.height}px`,
      ...config.style,
    };

    if (type === "image" && config.media?.type === "image") {
      return {
        ...baseStyle,
        borderRadius: `${config?.borderRadius ?? 0}%`,
      };
    }

    if (type === "buttonElement") {
      return {
        ...baseStyle,
      };
    }

    return baseStyle;
  }, [id, config, calculatePosition, isDragging, alignmentConfig, type]);

  // 添加日誌來追蹤元素狀態
  useEffect(() => {
    console.log(
      `Element ${id} - isEditing: ${isEditing}, isSelected: ${isSelected}`
    );
  }, [id, isEditing, isSelected]);

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(`[id="${id}"]`)) {
        return;
      }
      setIsElementSelected(false);
      setIsEditing(false);
    },
    [id]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const handleSelectComplete = useCallback(() => {
    setShouldSelectAll(false);
  }, []);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (type === "text" || type === "button") {
        setIsEditing(true);
        setIsElementSelected(false);
        setEditableContent(content as string);
        if (isFirstEditRef.current) {
          setTimeout(() => {
            setShouldSelectAll(true);
          }, 50);
          isFirstEditRef.current = false;
        }
      }
    },
    [type, content, setIsEditing, setIsElementSelected, setEditableContent]
  );

  // 失去焦點處理函式，保存編輯內容並更新元素
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (editableContent !== content) {
      onUpdate({ content: editableContent });
      updateSelectedElement(id, "content", editableContent);
    }
    isFirstEditRef.current = true;
  }, [
    id,
    setIsEditing,
    editableContent,
    content,
    onUpdate,
    updateSelectedElement,
  ]);

  // 輸入內容變更處理函式
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setEditableContent(newValue);
    },
    []
  );

  // 在編輯模式中設置文本選擇範圍
  useEffect(() => {
    if (isEditing && elementRef.current) {
      elementRef.current.focus();
      if (
        elementRef.current instanceof HTMLInputElement &&
        isFirstEditRef.current
      ) {
        elementRef.current.setSelectionRange(0, editableContent.length);
        isFirstEditRef.current = false;
      }
    } else if (!isEditing) {
      isFirstEditRef.current = true;
    }
  }, [isEditing, editableContent]);

  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!resizeStartRef.current || !resizeDirectionRef.current) return;

      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;

      const direction = resizeDirectionRef.current;

      // 計算新的尺寸
      if (direction.includes("right")) {
        newWidth = Math.max(50, resizeStartRef.current.width + deltaX);
      } else if (direction.includes("left")) {
        newWidth = Math.max(50, resizeStartRef.current.width - deltaX);
      }

      if (direction.includes("bottom")) {
        newHeight = Math.max(50, resizeStartRef.current.height + deltaY);
      } else if (direction.includes("top")) {
        newHeight = Math.max(50, resizeStartRef.current.height - deltaY);
      }

      // 更新本地 UI 狀態
      onUpdate({
        config: {
          ...config,
          size: { width: newWidth, height: newHeight },
        },
      });
    },
    [config, onUpdate]
  );

  const handleResizeEnd = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 立即移除事件監聽器
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", handleResizeEnd);

      setIsResizing(false);

      if (resizeDirectionRef.current) {
        // 使用最終的尺寸調用父組件的 handleResize 函數
        parentHandleResize(
          id,
          {
            width: config.size.width,
            height: config.size.height,
          },
          resizeDirectionRef.current
        );
      }

      resizeStartRef.current = { x: 0, y: 0, width: 0, height: 0 };
      resizeDirectionRef.current = null;
    },
    [
      handleResize,
      parentHandleResize,
      id,
      config.size.width,
      config.size.height,
    ]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: config.size.width,
        height: config.size.height,
      };
      resizeDirectionRef.current = direction;

      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", handleResizeEnd);
    },
    [config.size.width, config.size.height, handleResize, handleResizeEnd]
  );

  useEffect(() => {
    return () => {
      // 確保在組件卸載時清理所有事件監聽器
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [handleResize, handleResizeEnd]);
  // 鍵盤事件處理函式

  useEffect(() => {
    const handleKeyDown: EventListener = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (isEditing) {
        return;
      }

      if (
        keyboardEvent.key === "Backspace" &&
        document.activeElement === elementRef.current &&
        isSelected
      ) {
        keyboardEvent.preventDefault();
        keyboardEvent.stopPropagation();
        try {
          onDelete();
        } catch (error) {
          console.error(`Error deleting element ${id}:`, error);
        }
      }
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener("keydown", handleKeyDown);
      return () => {
        element.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [id, isEditing, isSelected, onDelete]);

  const renderContent = () => {
    if (isEditing) {
      return (
        <EditInput
          ref={elementRef as React.RefObject<HTMLInputElement>}
          value={editableContent}
          onChange={handleContentChange}
          onBlur={handleBlur}
          $config={config}
          shouldSelectAll={shouldSelectAll}
          onSelectComplete={handleSelectComplete}
          data-testid={`edit-input-${id}`}
        />
      );
    }
    const commonProps = {
      style: {
        margin: 0,
        padding: 0,
      },
      tabIndex: 0,
      onDoubleClick: handleDoubleClick,
    };

    switch (type) {
      case "text":
        return (
          <PElement
            {...commonProps}
            ref={elementRef as React.RefObject<HTMLParagraphElement>}
            onDoubleClick={handleDoubleClick}
            data-testid={`non-editable-content-${id}`}
            $config={config}
          >
            {content}
          </PElement>
        );
      case "buttonElement":
        return (
          <ButtonElement
            {...commonProps}
            ref={elementRef as React.RefObject<HTMLButtonElement>}
            data-testid={`non-editable-content-${id}`}
            $config={config}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {content}
          </ButtonElement>
        );
      case "image":
        let imageSrc = content as string;
        if (imageSrc.startsWith("/")) {
          imageSrc = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${imageSrc}`;
        }
        return (
          <ImageWrapperElement
            {...commonProps}
            ref={elementRef as React.RefObject<HTMLDivElement>}
            $config={config}
            data-testid={id}
          >
            <ImageElement
              src={
                config.media?.type === "image" && config.media.url
                  ? config.media.url
                  : imageSrc
              }
              alt={config.alt}
              layout="fill"
              sizes="100vw"
              $config={config}
            />
          </ImageWrapperElement>
        );
      case "list":
      default:
        return (
          <div
            {...commonProps}
            ref={elementRef as React.RefObject<HTMLDivElement>}
          >
            {content}
          </div>
        );
    }
  };

  return (
    <ElementWrapper
      ref={setNodeRef}
      style={style}
      $config={config}
      $isDragging={isDragging}
      $isSelected={isSelected}
      onMouseUp={parentOnMouseUp}
      onMouseDown={(e) => {
        if (!isEditing) {
          setIsElementSelected(true);
        }
      }}
      onDoubleClick={handleDoubleClick}
      tabIndex={isElementSelected ? 0 : -1}
      onFocus={(e) => {
        console.log(`Focus gained on element ${id}`);
        e.target.style.outline = "none";
      }}
      onBlur={() => {
        if (!isEditing) {
          setIsElementSelected(false);
        }
      }}
      data-testid={`element-wrapper-${id}`}
      {...(isLayout || isEditing ? {} : { ...attributes, ...listeners })}
    >
      {renderContent()}
      {isSelected && !isLayout && !isEditing && (
        <ResizeHandles onResize={handleResizeStart} />
      )}
    </ElementWrapper>
  );
};
export default FreeDraggableElement;
