import { UniqueIdentifier } from "@dnd-kit/core/dist/types";
import { LocalElementType, Position } from "./ElementInterface";

type AlignmentType = { [key: string]: number } | null;

export interface ElementContextType {
  // 當前所有元素
  elements: LocalElementType[];
  // 當前選中的元素
  selectedElement: LocalElementType | null;
  // 設置當前選中的元素
  setSelectedElement: (element: LocalElementType | null) => void;
  //  ID 設置當前選中的元素
  setSelectedElementId: (id: UniqueIdentifier | null) => void;
  // 添加新元素，元素不包含 ID
  addElement: (element: Omit<LocalElementType, "id">) => void;
  // 更新指定 ID 的元素
  updateElement: (
    id: UniqueIdentifier,
    updates: Partial<LocalElementType>
  ) => void;
  // 所有元素的属性更新，通常在整个元素库或所有元素的上下文中使用
  updateElementProperty: (
    id: UniqueIdentifier,
    propertyPath: string,
    value: any
  ) => void;
  // 特定的選中元素的属性更新
  updateSelectedElement: (
    id: UniqueIdentifier,
    propertyPath: string,
    value: any
  ) => void;
  // 刪除指定 ID 的元素
  deleteElement: (id: UniqueIdentifier) => void;
  // 重新排序元素
  reorderElement: (newOrder: UniqueIdentifier[]) => void;
  // 更新指定 ID 元素的位置
  updateElementPosition: (
    id: UniqueIdentifier,
    config: {
      position: Position;
    }
  ) => void;
  //
}

export type Action =
  // 添加一个新元素
  | { type: "ADD_ELEMENT"; payload: Omit<LocalElementType, "id"> }
  // 更新現有元素屬性
  | {
      type: "UPDATE_ELEMENT";
      payload: { id: UniqueIdentifier; updates: Partial<LocalElementType> };
    }
  //  所有元素的属性更新，通常在整个元素库或所有元素的上下文中使用
  | {
      type: "UPDATE_ELEMENT_PROPERTY";
      payload: {
        id: UniqueIdentifier;
        propertyPath: string;
        value: any;
      };
    }
  | {
      type: "UPDATE_SELECTED_ELEMENT";
      payload: {
        id: UniqueIdentifier;
        propertyPath: string;
        value: any;
      };
    }
  // 刪除現有元素
  | { type: "DELETE_ELEMENT"; payload: { id: UniqueIdentifier } }
  // 重新排列元素
  | {
      type: "REORDER_ELEMENT";
      payload: { newOrder: UniqueIdentifier[] };
    }
  // 更新元素的位置
  | {
      type: "UPDATE_ELEMENT_POSITION";
      payload: {
        id: UniqueIdentifier;
        config: {
          position: Position;
        };
      };
    }
  // 調整元素大小
  | {
      type: "RESIZE_ELEMENT";
      payload: { id: UniqueIdentifier; config: { height: number } };
    }
  // 設定選擇元素
  | { type: "SELECTED_ELEMENT"; payload: UniqueIdentifier | null }
  | { type: "SET_ELEMENTS"; payload: LocalElementType[] };
