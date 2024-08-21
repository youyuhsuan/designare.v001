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
  border: none;
  cursor: move;
  user-select: none;
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
  border: 1px solid
    ${(props) =>
      props.$isSelected ? props.theme.colors.accent : "transparent"};
  width: ${(props) => props.$config.size.width}px;
  height: ${(props) => props.$config.size.height}px;
  transform: translate(
    ${(props) => props.$config.position.x}px,
    ${(props) => props.$config.position.y}px
  );
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
  isLayout,
  onUpdate,
  onDelete,
  isSelected,
  onMouseUp,
}) => {
  const { updateSelectedElement } = useElementContext();

  // 編輯模式狀態
  const [isEditing, setIsEditing] = useState(false);
  // 編輯內容的值
  const [editableContent, setEditableContent] = useState(content as string);
  // 元素選擇狀態
  const [isElementSelected, setIsElementSelected] = useState(isSelected);

  // 引用輸入框元素
  const elementRef = useRef<
    HTMLInputElement | HTMLButtonElement | HTMLParagraphElement | null
  >(null);

  // 記錄是否正在調整大小
  const resizingRef = useRef(false);
  // 是否剛進入編輯模式
  const justEnteredEditMode = useRef(false);
  // 是否應該選擇所有內容
  const [shouldSelectAll, setShouldSelectAll] = useState(false);
  // 是否為第一次編輯
  const isFirstEditRef = useRef(true);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { type },
    });

  const style = useMemo(() => {
    const { x, y } = config.position;
    // 計算應用於 translate3d 的位移值
    const translateX = isDragging && transform ? x + transform.x : x;
    const translateY = isDragging && transform ? y + transform.y : y;

    const baseStyle: React.CSSProperties = {
      position: "absolute" as const,
      transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
      transition: isDragging ? "none" : "transform 0.3s ease-out",
    };
    return { ...baseStyle, ...(config || {}) };
  }, [config, isDragging, transform]);

  useEffect(() => {
    console.log("Editable content updated:", editableContent);
  }, [editableContent]);

  useEffect(() => {
    console.log(
      `Component ${id} mounted/updated. isEditing:`,
      isEditing,
      "isSelected:",
      isSelected,
      "content:",
      content
    );
  }, [id, isEditing, isSelected, content]);

  useEffect(() => {
    console.log("isEditing:", isEditing);
    console.log("elementRef.current:", elementRef.current);
  }, [isEditing]);

  useEffect(() => {
    console.log(`Editable content for ${id} updated:`, editableContent);
  }, [id, editableContent]);

  useEffect(() => {
    console.log("isEditing changed:", isEditing);
  }, [isEditing]);

  console.log("onDelete function:", onDelete);

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(`[id="${id}"]`)) return;
      setIsElementSelected(true);
      justEnteredEditMode.current = true;
      console.log("Set editing to true");
    },
    [id]
  );

  useEffect(() => {
    document.addEventListener("mouseup", handleOutsideClick);
    return () => {
      document.removeEventListener("mouseup", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const handleSelectComplete = useCallback(() => {
    setShouldSelectAll(false);
  }, []);

  // 雙擊事件處理函式，用於進入編輯模式
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      console.log(`Double click event triggered on element ${id}`);
      if (type === "text" || type === "button") {
        console.log(
          `Entering edit mode for element ${id}, current content: "${content}"`
        );
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
    [id, type, content, setIsEditing, setIsElementSelected, setEditableContent]
  );

  // 失去焦點處理函式，保存編輯內容並更新元素
  const handleBlur = useCallback(() => {
    console.log(`Blur event triggered for ${id}`);
    setIsEditing(false);
    if (editableContent !== content) {
      console.log(
        `Updating content for ${id} from`,
        content,
        "to",
        editableContent
      );
      onUpdate({ content: editableContent });
      updateSelectedElement(id, "content", editableContent);
    }
    isFirstEditRef.current = true; // Reset for next edit session
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
      console.log(
        `Content changing for ${id} from "${editableContent}" to "${newValue}"`
      );
      setEditableContent(newValue);
    },
    [id, editableContent]
  );

  // 在編輯模式中設置文本選擇範圍
  useEffect(() => {
    if (isEditing && elementRef.current) {
      console.log("isEditing && elementRef.current", elementRef.current);
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
      if (isEditing) {
        return;
      }

      if (
        event.key === "Backspace" &&
        elementRef.current &&
        document.activeElement === elementRef.current
      ) {
        console.log("Backspace pressed, attempting to delete");
        event.preventDefault();
        event.stopPropagation();
        onDelete();
      }
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener("keydown", handleKeyDown as EventListener);
      return () => {
        element.removeEventListener("keydown", handleKeyDown as EventListener);
      };
    }
  }, [isEditing, onDelete]);

  const renderContent = () => {
    console.log(
      `Rendering content for ${id}, isEditing:`,
      isEditing,
      "editableContent:",
      editableContent,
      "shouldSelectAll:",
      shouldSelectAll
    );
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

    console.log(`Rendering non-editable content for ${id}, content:`, content);
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
            onDoubleClick={handleDoubleClick}
            data-testid={`non-editable-content-${id}`}
          >
            {content}
          </button>
        );
      case "image":
        return (
          <div
            {...commonProps}
            ref={elementRef as React.RefObject<HTMLDivElement>}
            data-testid={`non-editable-content-${id}`}
          >
            <Image
              src={content as string}
              alt="Draggable"
              layout="fill"
              objectFit="contain"
            />
          </div>
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
      data-testid={`element-wrapper-${id}`}
      onKeyDown={(e) => {
        console.log("Key pressed in ElementWrapper:", e.key);
        if (!isEditing && e.key === "Backspace") {
          e.preventDefault();
          e.stopPropagation();
          onDelete();
        }
      }}
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
