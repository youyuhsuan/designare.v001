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

export type LocalElementType = LayoutElementData | FreeDraggableElementData;

export type ElementInstance = LocalElementType;

export interface ElementLibrary {
  byId: Record<string, LocalElementType>;
  allIds: string[];
  selectedId: string | null;
  configs?: any;
}

export interface LayoutElementData extends BaseElementData {
  children?: UniqueIdentifier[];
  config: any;
  isLayout: true;
}

export interface FreeDraggableElementData extends BaseElementData {
  isLayout: false;
  config: any;
}

export interface ElementCallbacks {
  onUpdate: (updates: Partial<LocalElementType>) => void;
  onDelete: () => void;
  onMouseUp: (event: React.MouseEvent) => void;
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
  $isSelected?: boolean;
  $config?: any;
  borderRadius?: number;
}

export interface Selection {
  start: number;
  end: number;
}
