import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "styled-components";
import { v4 } from "uuid";

// 類型定義
interface LayoutProps {
  id: string;
  content: React.ReactNode;
  height: number;
  onResize: (id: string, height: number) => void;
  onDelete: (id: string) => void;
  type?: "section";
}

interface SectionInnerElementProps {
  id: string;
  content: string;
}

interface FreeDraggableElementData {
  id: string;
  content: React.ReactNode;
  position: { x: number; y: number };
  height: number;
}

// 樣式組件
const SectionWrapper = styled.div<{ $isDragging: boolean }>`
  position: relative;
  margin-bottom: 10px;
  background-color: ${(props) => (props.$isDragging ? "#f0f0f0" : "white")};
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Section = styled.div`
  padding: 10px;
`;

const SectionContent = styled.div`
  min-height: 50px;
`;

const DragHandle = styled.div`
  cursor: move;
  padding: 5px;
  background-color: #eee;
  text-align: center;
`;

const ResizeHandle = styled.div`
  height: 10px;
  background-color: #f0f0f0;
  cursor: ns-resize;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const FreeDraggableLayer = styled.div`
  position: relative;
  height: 100%;
`;

// 內部元素組件
// const SectionInnerElement: React.FC<SectionInnerElementProps> = ({
//   id,
//   content,
// }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     border: "1px solid #ccc",
//     margin: "5px 0",
//     padding: "5px",
//     backgroundColor: "white",
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {content}
//     </div>
//   );
// };

// 自由拖放元素組件
// 拖拽處理: 處理拖拽事件，讓元素可以自由拖動
// 大小調整: 提供了一個可以拖動的句柄來改變元素的高度
// 刪除功能: 包含一個按鈕來刪除該元素
// const FreeDraggableElement: React.FC<
//   FreeDraggableElementData & {
//     onResize: (height: number) => void;
//     onDelete: () => void;
//     onPositionChange: (position: { x: number; y: number }) => void;
//   }
// > = ({
//   id,
//   content,
//   position,
//   height,
//   onResize,
//   onDelete,
//   onPositionChange,
// }) => {
//   const [isDragging, setIsDragging] = useState(false);

//   const handleDragStart = (e: React.DragEvent) => {
//     setIsDragging(true);
//     e.dataTransfer.setData("text/plain", id);
//   };

//   const handleDragEnd = () => {
//     setIsDragging(false);
//   };

//   const handleResize = useCallback(
//     (e: React.MouseEvent) => {
//       e.preventDefault();
//       const startY = e.clientY;
//       const startHeight = height;

//       const handleMouseMove = (e: MouseEvent) => {
//         const deltaY = e.clientY - startY;
//         onResize(Math.max(50, startHeight + deltaY));
//       };

//       const handleMouseUp = () => {
//         document.removeEventListener("mousemove", handleMouseMove);
//         document.removeEventListener("mouseup", handleMouseUp);
//       };

//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//     },
//     [height, onResize]
//   );

//   return (
//     <div
//       style={{
//         position: "absolute",
//         left: position.x,
//         top: position.y,
//         width: "200px",
//         height: `${height}px`,
//         border: "1px solid #ccc",
//         backgroundColor: isDragging ? "#f0f0f0" : "white",
//         padding: "10px",
//         cursor: "move",
//       }}
//       draggable
//       onDragStart={handleDragStart}
//       onDragEnd={handleDragEnd}
//     >
//       {content}
//       <button onClick={onDelete}>Delete</button>
//       <div
//         style={{
//           position: "absolute",
//           bottom: 0,
//           left: 0,
//           right: 0,
//           height: "10px",
//           backgroundColor: "#f0f0f0",
//           cursor: "ns-resize",
//         }}
//         onMouseDown={handleResize}
//       />
//     </div>
//   );
// };

// 主要布局組件
const Layout: React.FC<LayoutProps> = ({
  id,
  content,
  height,
  onResize,
  onDelete,
  type = "section",
}) => {
  const [sectionInnerElements, setSectionInnerElements] = useState<
    SectionInnerElementProps[]
  >([]);
  const [freeDraggableElements, setFreeDraggableElements] = useState<
    FreeDraggableElementData[]
  >([]);
  const [isHandleVisible, setIsHandleVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const toggleHandle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHandleVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        setIsHandleVisible(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Backspace" &&
        document.activeElement === elementRef.current
      ) {
        event.preventDefault();
        event.stopPropagation();
        onDelete(id);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [id, onDelete]);

  const handleResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const startY = e.clientY;
      const startHeight = height;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaY = e.clientY - startY;
        onResize(id, Math.max(100, startHeight + deltaY));
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [id, height, onResize]
  );

  const handleKeyResize = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const delta = e.key === "ArrowUp" ? -10 : 10;
        onResize(id, Math.max(100, height + delta));
      }
    },
    [id, height, onResize]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSectionInnerElements((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // const addInnerElement = () => {
  //   const newElement = {
  //     id: v4(),
  //     content: "New Inner Element",
  //   };
  //   setSectionInnerElements((prev) => [...prev, newElement]);
  // };

  const addFreeDraggableElement = () => {
    const newElement: FreeDraggableElementData = {
      id: v4(),
      content: "New Free Element",
      position: { x: 0, y: 0 },
      height: 100,
    };
    setFreeDraggableElements((prev) => [...prev, newElement]);
  };

  const updateFreeDraggableElementPosition = (
    id: string,
    position: { x: number; y: number }
  ) => {
    setFreeDraggableElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, position } : el))
    );
  };

  const resizeFreeDraggableElement = (id: string, height: number) => {
    setFreeDraggableElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, height } : el))
    );
  };

  const deleteFreeDraggableElement = (id: string) => {
    setFreeDraggableElements((prev) => prev.filter((el) => el.id !== id));
  };

  return (
    <SectionWrapper
      ref={setNodeRef}
      style={style}
      $isDragging={isDragging}
      role="region"
      aria-label={`${type} content`}
      onClick={toggleHandle}
    >
      // SectionWrapper 可拖拽的區域
      <Section ref={elementRef} tabIndex={0}>
        {isHandleVisible && (
          <DragHandle
            {...attributes}
            {...listeners}
            role="button"
            aria-label="Drag to reorder"
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
          >
            Drag
          </DragHandle>
        )}
        <SectionContent style={{ height }}>
          {content}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* <SortableContext
              items={sectionInnerElements.map((e) => e.id)}
              strategy={verticalListSortingStrategy}
            >
              {sectionInnerElements.map((innerElement) => (
                <SectionInnerElement key={innerElement.id} {...innerElement} />
              ))}
            </SortableContext> */}
          </DndContext>
        </SectionContent>
        <ResizeHandle
          role="slider"
          aria-label="Resize section"
          aria-valuemin={100}
          aria-valuemax={1000}
          aria-valuenow={height}
          tabIndex={0}
          onMouseDown={handleResize}
          onKeyDown={handleKeyResize}
        />
      </Section>
      <FreeDraggableLayer>
        {freeDraggableElements.map((element) => (
          <FreeDraggableElement
            key={element.id}
            {...element}
            onResize={(newHeight) =>
              resizeFreeDraggableElement(element.id, newHeight)
            }
            onDelete={() => deleteFreeDraggableElement(element.id)}
            onPositionChange={(newPosition) =>
              updateFreeDraggableElementPosition(element.id, newPosition)
            }
          />
        ))}
      </FreeDraggableLayer>
    </SectionWrapper>
  );
};

export default Layout;
