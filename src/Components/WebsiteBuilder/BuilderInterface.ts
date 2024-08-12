import { UniqueIdentifier } from "@dnd-kit/core/dist/types";

// 基础类型
export interface Position {
  x: number;
  y: number;
}

// 基础元素数据接口
export interface BaseElementData {
  id: string;
  type: string;
  content: string;
  height: number;
  isDragging?: boolean;
}

// 全局元素类型
export interface GlobalElementType extends BaseElementData {
  isLayout: boolean;
  defaultProps: {
    position?: Position;
  };
}

// 全局状态
export interface GlobalState {
  elementLibrary: GlobalElementType[];
  siteWidth: string;
  canvasHeight: string;
}

// 局部元素类型
export type LocalElementType = LayoutElementData | FreeDraggableElementData;

// 布局元素数据接口
export interface LayoutElementData extends BaseElementData {
  isLayout: true;
}

// 自由拖动元素数据接口
export interface FreeDraggableElementData extends BaseElementData {
  isLayout: false;
  position: Position;
}

// 元素回调接口
export interface ElementCallbacks {
  onUpdate: (updates: Partial<LocalElementType>) => void;
  onDelete: () => void;
}

// 布局元素属性接口（包含回调）
export type LayoutElementProps = LayoutElementData & ElementCallbacks;

// 自由拖动元素属性接口（包含回调）
export type FreeDraggableElementProps = FreeDraggableElementData &
  ElementCallbacks;

// ElementContext 类型
export interface ElementContextType {
  elements: LocalElementType[];
  addElement: (element: LocalElementType) => void;
  updateElement: (
    id: UniqueIdentifier,
    updates: Partial<LocalElementType>
  ) => void;
  deleteElement: (id: UniqueIdentifier) => void;
  updateElementPosition: (id: UniqueIdentifier, position: Position) => void;
  reorderElement: (
    activeId: UniqueIdentifier,
    overId: UniqueIdentifier
  ) => void;
}

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
