import { UniqueIdentifier } from "@dnd-kit/core";
import { AlignmentConfig, Size } from "../CanvasArea";
import { ElementConfig } from "./ElementConfigInterface";

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
  children?: LocalElementType[];
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
  onSelect?: (params: { id: string; path: string[] }) => void;
  isSelected: boolean;
}

export interface FreeDraggableElementCallbacks {
  onMouseUp: (event: React.MouseEvent) => void; // 移除可選性
  calculatePosition: (
    element: { id: string; config: ElementConfig },
    alignmentConfig: AlignmentConfig
  ) => Position; // 更新參數
  alignmentConfig: AlignmentConfig; // 移除可選性
  handleResize: (elementId: string, newSize: Size, direction: string) => void;
}
// 布局元素（包含回调）
export type LayoutElementProps = LayoutElementData & ElementCallbacks;

// 自由拖動元素（包含回调）
export type FreeDraggableElementProps = FreeDraggableElementData &
  ElementCallbacks &
  FreeDraggableElementCallbacks;

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
  $flexDirection?: string;
  $width?: string;
  borderRadius?: number;
}

export interface Selection {
  start: number;
  end: number;
}
