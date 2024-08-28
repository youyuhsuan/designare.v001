"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useDraggable } from "@dnd-kit/core";
import styled from "styled-components";
import Image from "next/image";
import { ContentProps, FreeDraggableElementProps } from "../BuilderInterface";
import { useElementContext } from "../Slider/ElementContext";
import ResizeHandles from "./handleResize";
import EditInput from "./EditInput";
import { commonStyles } from "./commonStyles";

const ElementWrapper = styled.div<ContentProps>`
  position: absolute;
  cursor: move;
  user-select: none;
  object-fit: ${(props) => props.$config?.objectFit};
  letter-spacing: ${(props) => props.$config.letterSpacing};
  line-height: ${(props) => props.$config.lineHeight};
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
  border: 1px solid
    ${(props) => (props.$isSelected ? props.theme.colors.accent : "none")};
  width: ${(props) => props.$config?.size?.width}px;
  height: ${(props) => props.$config?.size?.height}px;
`;

const ElementImageWrapper = styled.div<ContentProps>`
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: ${(props) => `${props.$config?.borderRadius}%`};
`;

const ElementImage = styled(Image)<ContentProps>`
  object-fit: ${(props) => props.$config?.objectFit};
`;

const P = styled.p<ContentProps>`
  ${commonStyles}
  cursor: text;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px
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
  calculatePosition,
  alignmentConfig,
  isLayout,
  onUpdate,
  onDelete,
  isSelected,
  onMouseUp,
}) => {
  const { updateSelectedElement } = useElementContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content as string);
  const [isElementSelected, setIsElementSelected] = useState(isSelected);

  const elementRef = useRef<
    HTMLInputElement | HTMLButtonElement | HTMLParagraphElement | null
  >(null);

  const resizingRef = useRef(false);
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

    // 只有在元素類型為 "image" 時才添加 borderRadius
    if (type === "image" && config.media?.type === "image") {
      return {
        ...baseStyle,
        borderRadius: `${config?.borderRadius ?? 0}%`,
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
    (e: React.MouseEvent, direction: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (resizingRef.current) return;
      resizingRef.current = true;

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = config.size.width;
      const startHeight = config.size.height;
      const startLeft = config.position.x;
      const startTop = config.position.y;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (resizingRef.current) {
          let newWidth = startWidth;
          let newHeight = startHeight;
          let newLeft = startLeft;
          let newTop = startTop;

          const deltaX = moveEvent.clientX - startX;
          const deltaY = moveEvent.clientY - startY;

          switch (direction) {
            case "right":
              newWidth = Math.max(50, startWidth + deltaX);
              break;
            case "left":
              newWidth = Math.max(50, startWidth - deltaX);
              newLeft = startLeft + startWidth - newWidth;
              break;
            case "bottom":
              newHeight = Math.max(50, startHeight + deltaY);
              break;
            case "top":
              newHeight = Math.max(50, startHeight - deltaY);
              newTop = startTop + startHeight - newHeight;
              break;
            case "top-left":
              newWidth = Math.max(50, startWidth - deltaX);
              newHeight = Math.max(50, startHeight - deltaY);
              newLeft = startLeft + startWidth - newWidth;
              newTop = startTop + startHeight - newHeight;
              break;
            case "top-right":
              newWidth = Math.max(50, startWidth + deltaX);
              newHeight = Math.max(50, startHeight - deltaY);
              newTop = startTop + startHeight - newHeight;
              break;
            case "bottom-left":
              newWidth = Math.max(50, startWidth - deltaX);
              newHeight = Math.max(50, startHeight + deltaY);
              newLeft = startLeft + startWidth - newWidth;
              break;
            case "bottom-right":
              newWidth = Math.max(50, startWidth + deltaX);
              newHeight = Math.max(50, startHeight + deltaY);
              break;
          }

          onUpdate({
            config: {
              ...config,
              size: { width: newWidth, height: newHeight },
              position: { x: newLeft, y: newTop },
            },
          });
        }
      };

      const handleMouseUp = () => {
        resizingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [config, onUpdate]
  );

  // 鍵盤事件處理函式
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!element) return;
      if (isEditing) {
        return;
      }
      if (event.key === "Backspace" && document.activeElement === element) {
        event.preventDefault();
        event.stopPropagation();
        onDelete();
      }
    };

    const element = elementRef.current;

    if (element) {
      return () => {
        element.removeEventListener("keydown", handleKeyDown as EventListener);
      };
    }
  }, [isEditing, onDelete]);

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
          <P
            {...commonProps}
            ref={elementRef as React.RefObject<HTMLParagraphElement>}
            tabIndex={0}
            onDoubleClick={handleDoubleClick}
            data-testid={`non-editable-content-${id}`}
            $config={config}
          >
            {content}
          </P>
        );
      case "button":
        return (
          <button
            {...commonProps}
            ref={elementRef as React.RefObject<HTMLButtonElement>}
            tabIndex={0}
            onDoubleClick={handleDoubleClick}
            data-testid={`non-editable-content-${id}`}
          >
            {content}
          </button>
        );
      case "image":
        let imageSrc = content as string;
        if (imageSrc.startsWith("/")) {
          imageSrc = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${imageSrc}`;
        }
        return (
          <ElementImageWrapper
            {...commonProps}
            ref={elementRef as React.RefObject<HTMLDivElement>}
            $config={config}
            tabIndex={0}
            data-testid={id}
          >
            <ElementImage
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
          </ElementImageWrapper>
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
      onMouseUp={onMouseUp}
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
      onFocus={(e) => {
        // 防止焦点引起的位移
        e.target.style.outline = "none";
      }}
      data-testid={`element-wrapper-${id}`}
      {...(isLayout || isEditing ? {} : { ...attributes, ...listeners })}
    >
      {renderContent()}
      {isElementSelected && !isLayout && !isEditing && (
        <ResizeHandles onResize={handleResize} />
      )}
    </ElementWrapper>
  );
};

export default FreeDraggableElement;
