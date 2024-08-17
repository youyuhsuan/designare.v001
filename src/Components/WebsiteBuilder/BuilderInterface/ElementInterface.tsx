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

export type LocalElementType = LayoutElementData | FreeDraggableElementData;

export interface LayoutElementData extends BaseElementData {
  children?: UniqueIdentifier[];
  config: any;
  // config: {
  //   size: { width: string; height: number };
  //   responsiveBehavior: "scaleProportionally" | "fitWidth" | "fitHeight";
  //   useMaxWidth: boolean;
  //   boxModelEditor: {
  //     padding: [number, number, number, number];
  //     margin: [number, number, number, number];
  //   };
  //   backgroundColor?: string;
  //   backgroundOpacity?: number;
  //   media?: { type: "image" | "video"; url: string };
  // };
  isLayout: true;
}

// TODO:寫完整
export interface FreeDraggableElementData extends BaseElementData {
  isLayout: false;
  config: any;
}

export interface ElementCallbacks {
  onUpdate: (updates: Partial<LocalElementType>) => void;
  onDelete: () => void;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  isSelected: boolean;
}

// 布局元素（包含回调）
export type LayoutElementProps = LayoutElementData & ElementCallbacks;

// 自由拖動元素（包含回调）
export type FreeDraggableElementProps = FreeDraggableElementData &
  ElementCallbacks;

export interface LayoutProps extends LayoutElementData, ElementCallbacks {
  key: string;
  isDragging?: boolean;
}

export interface FreeDraggableProps
  extends FreeDraggableElementData,
    ElementCallbacks {
  key: string;
  isDragging?: boolean;
}

export interface ContentProps {
  $isDragging?: boolean;
  isSelected?: boolean;
  $config: any;
}
