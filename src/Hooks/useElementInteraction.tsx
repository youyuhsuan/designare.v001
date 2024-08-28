import { useState, useRef, useCallback, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";

interface ElementInteractionProps {
  id: string;
  type: string;
  content: string;
  config: any;
  isSelected: boolean;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  parentHandleResize: (id: string, size: any, direction: string) => void;
  parentOnMouseUp: (e: MouseEvent) => void;
}

export const useElementInteraction = ({
  id,
  type,
  content,
  config,
  isSelected,
  onUpdate,
  onDelete,
  parentHandleResize,
  parentOnMouseUp,
}: ElementInteractionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableContent, setEditableContent] = useState(content);
  const [interactionMode, setInteractionMode] = useState<
    "none" | "dragging" | "resizing"
  >("none");

  const elementRef = useRef<HTMLElement | null>(null);
  const interactionStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const resizeDirectionRef = useRef<string | null>(null);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { type },
    });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (interactionMode === "resizing") {
        const deltaX = e.clientX - interactionStartRef.current.x;
        const deltaY = e.clientY - interactionStartRef.current.y;
        let newWidth = interactionStartRef.current.width;
        let newHeight = interactionStartRef.current.height;

        const direction = resizeDirectionRef.current;
        if (direction?.includes("right")) newWidth += deltaX;
        if (direction?.includes("left")) newWidth -= deltaX;
        if (direction?.includes("bottom")) newHeight += deltaY;
        if (direction?.includes("top")) newHeight -= deltaY;

        newWidth = Math.max(50, newWidth);
        newHeight = Math.max(50, newHeight);

        onUpdate({
          config: {
            ...config,
            size: { width: newWidth, height: newHeight },
          },
        });
      }
    },
    [interactionMode, config, onUpdate]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (interactionMode === "resizing") {
        parentHandleResize(
          id,
          {
            width: config.size.width,
            height: config.size.height,
          },
          resizeDirectionRef.current || ""
        );
      }

      setInteractionMode("none");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      parentOnMouseUp(e);
    },
    [
      interactionMode,
      handleMouseMove,
      parentOnMouseUp,
      parentHandleResize,
      id,
      config.size.width,
      config.size.height,
    ]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isEditing) return;

      const target = e.target as HTMLElement;
      if (target.closest(".resize-handle")) {
        setInteractionMode("resizing");
        const direction = target.getAttribute("data-direction") || "";
        resizeDirectionRef.current = direction;
      } else {
        setInteractionMode("dragging");
      }

      interactionStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: config.size.width,
        height: config.size.height,
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [
      isEditing,
      config.size.width,
      config.size.height,
      handleMouseMove,
      handleMouseUp,
    ]
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (type === "text" || type === "button") {
        setIsEditing(true);
        setEditableContent(content);
      }
    },
    [type, content]
  );

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (editableContent !== content) {
      onUpdate({ content: editableContent });
    }
  }, [editableContent, content, onUpdate]);

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditableContent(e.target.value);
    },
    []
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditing || !isSelected) return;
      if (
        event.key === "Backspace" &&
        document.activeElement === elementRef.current
      ) {
        event.preventDefault();
        event.stopPropagation();
        onDelete();
      }
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener("keydown", handleKeyDown);
      return () => element.removeEventListener("keydown", handleKeyDown);
    }
  }, [isEditing, isSelected, onDelete]);

  return {
    isEditing,
    editableContent,
    interactionMode,
    elementRef,
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    handleMouseDown,
    handleDoubleClick,
    handleBlur,
    handleContentChange,
  };
};
