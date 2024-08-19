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
import {
  ContentProps,
  FreeDraggableElementProps,
  Selection,
} from "../BuilderInterface";
import { useElementContext } from "../Slider/ElementContext";
import ResizeHandles from "./handleResize";

const ElementWrapper = styled.div<ContentProps>`
  position: absolute;
  cursor: move;
  position: absolute;
  user-select: none;
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
  border: 1px solid ${(props) => (props.isSelected ? "blue" : "transparent")};
`;

const EditInput = styled.input<ContentProps>`
  border: none;
  background: transparent;
  color: ${(props) => props.$config.textColor};
  opacity: ${(props) => props.$config.opacity};
  font-size: ${(props) => props.$config.fontSize};
  font-family: ${(props) => props.$config.fontFamily};
  padding: 0;
  margin: 0;
  &::selection {
    background-color: #b3d4fc;
  }
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
  // 使用自訂 Hook 獲取上下文中的函式
  const { updateSelectedElement } = useElementContext();

  // 狀態
  // 編輯模式
  const [isEditing, setIsEditing] = useState(false);
  // 編輯內容的值
  const [editableContent, setEditableContent] = useState(content as string);

  const [isElementSelected, setIsElementSelected] = useState(isSelected);
  // 文本選擇範圍
  const [selection, setSelection] = useState<Selection | null>(null);

  // 引用記錄是否正在調整大小
  const resizingRef = useRef(false);
  const isDraggingRef = useRef(false);

  // 引用輸入框元素以便焦點管理
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // 點擊事件處理函式，避免事件冒泡並調用傳入的 onClick 函式
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isDraggingRef.current) {
        setIsElementSelected(true);
        onClick(e);
      }
    },
    [onClick]
  );

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(`[data-id="${id}"]`)) return;
      setIsElementSelected(false);
    },
    [id]
  );

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  // 雙擊事件處理函式，用於進入編輯模式
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (type === "text" || type === "button") {
        setIsEditing(true);
        setIsElementSelected(false);
        setSelection({ start: 0, end: editableContent.length }); // 設置文本選擇範圍
        console.log("Set editing to true, selection:", {
          start: 0,
          end: editableContent.length,
        });
      }
    },
    [type, editableContent]
  );

  // 失去焦點處理函式，保存編輯內容並更新元素
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    setSelection(null);
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

  // TODO:FIX
  // 在編輯模式中設置文本選擇範圍
  useEffect(() => {
    if (!selection || !isEditing) return;

    const selectText = () => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(selection.start, selection.end);
        inputRef.current.focus();
      } else {
        console.log("Input ref is null");
      }
    };

    // 使用 requestAnimationFrame 確保在下一個動畫幀執行選擇操作
    const frameId = requestAnimationFrame(() => {
      selectText();
      // 為了更高的可靠性，我們再次嘗試在短暫延遲後選擇文本
      setTimeout(selectText, 0);
    });

    return () => cancelAnimationFrame(frameId);
  }, [selection, isEditing]);

  // 鍵盤事件處理函式
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditing && document.activeElement === inputRef.current) {
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
        document.activeElement === inputRef.current
      ) {
        event.preventDefault();
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

  const customListeners = useMemo(
    () => ({
      ...listeners,
      onMouseDown: (e: React.MouseEvent) => {
        isDraggingRef.current = false;
        listeners?.onMouseDown?.(e);
      },
      onMouseMove: (e: React.MouseEvent) => {
        isDraggingRef.current = true;
        listeners?.onMouseMove?.(e);
      },
      onMouseUp: (e: React.MouseEvent) => {
        if (!isDraggingRef.current) {
          handleClick(e);
        }
        isDraggingRef.current = false;
        listeners?.onMouseUp?.(e);
      },
    }),
    [listeners, handleClick]
  );

  const renderContent = () => {
    if (isEditing) {
      return (
        <EditInput
          ref={inputRef}
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
          autoFocus // 添加 autoFocus 屬性
        />
      );
    }

    switch (type) {
      case "text":
        return (
          <p ref={textRef} onDoubleClick={handleDoubleClick}>
            {content}
          </p>
        );
      case "button":
        return (
          <button ref={buttonRef} onDoubleClick={handleDoubleClick}>
            {content}
          </button>
        );
      case "image":
        return (
          <Image
            src={content as string}
            alt="Draggable"
            layout="fill"
            objectFit="contain"
          />
        );
      case "columns":
      case "container":
      case "list":
      default:
        return <div>{content}</div>;
    }
  };

  return (
    <ElementWrapper
      ref={setNodeRef} // 設置節點引用
      style={style} // 應用計算好的樣式
      $config={config} // 傳遞配置
      $isDragging={isDragging} // 傳遞拖動狀態
      isSelected={isSelected} // 傳遞選中狀態
      onClick={handleClick} // 點擊事件處理函式
      onDoubleClick={handleDoubleClick} // 雙擊事件處理函式
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
