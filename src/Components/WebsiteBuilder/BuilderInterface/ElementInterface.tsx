import { UniqueIdentifier } from "@dnd-kit/core";

export interface Position {
  x: number;
  y: number;
}

export interface BaseElementData {
  id: string;
  type: string;
  content: string;
  isDragging?: boolean;
  [key: string]: any;
}

export interface GlobalElementType extends BaseElementData {
  isLayout: boolean;
  defaultProps: {
    position?: Position;
  };
}

// 局部元素
export type LocalElementType = LayoutElementData | FreeDraggableElementData;

// 布局元素
export interface LayoutElementData extends BaseElementData {
  children?: UniqueIdentifier[];
  config: {
    size: { width: string; height: number };
    responsiveBehavior: "scaleProportionally" | "fitWidth" | "fitHeight";
    useMaxWidth: boolean;
    boxModelEditor: {
      padding: [number, number, number, number];
      margin: [number, number, number, number];
    };
    backgroundColor?: string;
    backgroundOpacity?: number;
    media?: { type: "image" | "video"; url: string };
  };
  isLayout: true;
}

// 自由拖動元素
export interface FreeDraggableElementData extends BaseElementData {
  isLayout: false;
  position: Position;
  zIndex?: number;
}

// 元素回调接口
export interface ElementCallbacks {
  onUpdate: (updates: Partial<LocalElementType>) => void;
  onDelete: () => void;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  isSelected?: boolean;
}

// 布局元素（包含回调）
export type LayoutElementProps = LayoutElementData & ElementCallbacks;

// 自由拖動元素（包含回调）
export type FreeDraggableElementProps = FreeDraggableElementData &
  ElementCallbacks;

// 布局元素属性接口（含拖动状态）
export interface LayoutProps extends LayoutElementData, ElementCallbacks {
  key: string;
  isDragging?: boolean;
}

// 自由拖動（含拖动状态）
export interface FreeDraggableProps
  extends FreeDraggableElementData,
    ElementCallbacks {
  key: string;
  isDragging?: boolean;
}
