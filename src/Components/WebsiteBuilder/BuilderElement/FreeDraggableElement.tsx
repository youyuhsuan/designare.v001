"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useLayoutEffect,
  forwardRef,
} from "react";
import { useDraggable } from "@dnd-kit/core";
import styled from "styled-components";
import Image from "next/image";
import {
  ContentProps,
  FreeDraggableElementProps,
  Selection,
} from "../BuilderInterface";
import { useElementContext } from "../Slider/ElementContext";
import ResizeHandles from "./handleResize";

const ElementWrapper = styled.div<ContentProps>`
  border: none;
  position: absolute;
  cursor: move;
  position: absolute;
  user-select: none;
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
  border: 1px solid
    ${(props) =>
      props.$isSelected ? props.theme.colors.accent : "transparent"};
`;

const StyledInput = styled.input<ContentProps>`
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  resize: none;
  overflow: hidden;
  font-size: ${(props) => props.$config.fontSize}px;
  font-weight: ${(props) => props.$config.fontWeight};
  text-align: ${(props) => props.$config.textAlign};
  color: ${(props) => props.$config.textColor};
  opacity: ${(props) => props.$config.opacity};
  font-size: ${(props) => props.$config.fontSize};
  font-family: ${(props) => props.$config.fontFamily};
  &::selection {
    background-color: ${(props) => props.theme.colors.accent};
  }
`;

const P = styled.p<ContentProps>`
  padding: 0;
  margin: 0;
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

const EditInput = forwardRef<HTMLInputElement, EditInputProps>((props, ref) => {
  console.log("EditInput rendered, ref:", ref);
  return <StyledInput ref={ref} {...props} />;
});

EditInput.displayName = "EditInput";

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
  // 使用自訂 Hook 獲取上下文中的函式
  const { updateSelectedElement } = useElementContext();

  // 狀態
  // 編輯模式
  const [isEditing, setIsEditing] = useState(false);
  // 編輯內容的值
  const [editableContent, setEditableContent] = useState(content as string);
  // 選擇
  const [isElementSelected, setIsElementSelected] = useState(isSelected);
  // 引用記錄是否正在調整大小
  const resizingRef = useRef(false);

  const justEnteredEditMode = useRef(false);

  // 引用輸入框元素以便焦點管理
  const elementRef = useRef<HTMLInputElement>(null);

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
      color: config.textColor,
      // width: config.size.width,
      // height: config.size.height,
    };

    if (config.opacity) {
      baseStyle.opacity = config.textColorOpacity;
    }

    return { ...baseStyle, ...(config || {}) };
  }, [config, isDragging, transform]);

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

  // 雙擊事件處理函式，用於進入編輯模式
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (type === "text" || type === "button") {
        setIsEditing(true);
        setIsElementSelected(false);
        justEnteredEditMode.current = true;
      }
    },
    [type]
  );

  // 失去焦點處理函式，保存編輯內容並更新元素
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (!setIsEditing && justEnteredEditMode.current) {
      justEnteredEditMode.current = false;
      return;
    }
    setIsElementSelected(false);
    console.log("Blur event triggered");
    if (editableContent !== content) {
      onUpdate({ content: editableContent });
      updateSelectedElement(id, "content", editableContent);
    }
  }, [editableContent, content, id, onUpdate, updateSelectedElement]);

  // 輸入內容變更處理函式
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditableContent(e.target.value);
    },
    []
  );

  // 在編輯模式中設置文本選擇範圍
  useEffect(() => {
    if (isEditing && elementRef.current) {
      console.log(
        "isEditing && elementRef.current",
        isEditing && elementRef.current
      );
      elementRef.current.focus();
      elementRef.current.setSelectionRange(0, editableContent.length);
    }
  }, [isEditing, editableContent]);

  useEffect(() => {
    console.log("isEditing:", isEditing);
    console.log("elementRef.current:", elementRef.current);
  }, [isEditing]);

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
      if (isEditing && document.activeElement === elementRef.current) {
        if (event.key === "Escape") {
          // 按下 Escape 退出編輯模式
          setIsEditing(false);
          setEditableContent(content as string); // 恢復原始內容
        } else if (event.key === "Enter") {
          // 按下 Enter 保存修改
          handleBlur();
        }
      } else if (
        !isEditing &&
        event.key === "Backspace" &&
        document.activeElement === elementRef.current
      ) {
        // event.preventDefault();
        event.stopPropagation();
        onDelete();
        // console.log(`Element ${id} - Deleted`);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [id, onDelete, isEditing, editableContent, content, handleBlur]);

  const renderContent = () => {
    if (isEditing) {
      return (
        <EditInput
          ref={elementRef}
          value={editableContent}
          $config={config}
          onChange={handleContentChange}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            console.log("Key pressed:", e.key);
            if (e.key === "Enter") {
              e.preventDefault(); // 防止在文本區域中添加新行
              handleBlur();
            }
          }}
          autoFocus
        />
      );
    }

    const commonProps = {
      style: {
        margin: 0,
        padding: 0,
      },
    };

    switch (type) {
      case "text":
        return (
          <P
            {...commonProps}
            ref={elementRef}
            onDoubleClick={handleDoubleClick}
          >
            {content}
          </P>
        );
      case "button":
        return (
          <button
            {...commonProps}
            ref={elementRef}
            onDoubleClick={handleDoubleClick}
          >
            {content}
          </button>
        );
      case "image":
        return (
          <Image
            {...commonProps}
            src={content as string}
            alt="Draggable"
            layout="fill"
            objectFit="contain"
          />
        );
      case "list":
      default:
        return <div>{content}</div>;
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
