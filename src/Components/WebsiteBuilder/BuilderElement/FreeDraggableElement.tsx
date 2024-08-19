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

const ElementWrapper = styled.div<ContentProps>`
  position: absolute;
  cursor: move;
  position: absolute;
  user-select: none;
  color: ${(props) => props.$config.color};
  opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
  border: 1px solid ${(props) => (props.isSelected ? "blue" : "transparent")};
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
  &::selection {
    background-color: #b3d4fc;
  }
`;

const ResizeHandle = styled.div`
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 10px;
  height: 10px;
  background-color: blue;
  cursor: se-resize;
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

  // 編輯模式狀態和可編輯內容狀態
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content as string);

  const [selection, setSelection] = useState<Selection | null>(null);
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
    const translateX = isDragging && transform ? x + transform.x : x;
    const translateY = isDragging && transform ? y + transform.y : y;

    return {
      position: "absolute" as const,
      transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
      transition: isDragging ? "none" : "transform 0.3s ease-out",
      // width: config.size.width,
      // height: config.size.height,
    };
  }, [config.position, isDragging, transform]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(e);
  };

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (type === "text" || type === "button") {
        setIsEditing(true);
        setSelection({ start: 0, end: editableContent.length });
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
    console.log("Blur event triggered");
    // setSelection(null);
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

  useEffect(() => {
    if (!selection || !isEditing) return;

    const selectText = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        // console.log("Attempting to select text");

        inputRef.current.setSelectionRange(selection.start, selection.end);
        inputRef.current.select();
        // console.log("Selection range set:", selection.start, selection.end);
        // console.log(
        //   "Actual selection:",
        //   inputRef.current.selectionStart,
        //   inputRef.current.selectionEnd
        // );
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
        console.log(`Element ${id} - Deleted`);
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

  const handleResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = config.size.width;
      const startHeight = config.size.height;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = Math.max(50, startWidth + moveEvent.clientX - startX);
        const newHeight = Math.max(
          50,
          startHeight + moveEvent.clientY - startY
        );
        onUpdate({
          config: { ...config, size: { width: newWidth, height: newHeight } },
        });
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
      {!isLayout && isSelected && !isEditing && (
        <ResizeHandle onMouseDown={handleResize} />
      )}
    </ElementWrapper>
  );
};

export default FreeDraggableElement;
