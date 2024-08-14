"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useState,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  LocalElementType,
  FreeDraggableElementData,
  Position,
  LayoutElementData,
} from "../BuilderInterface";
import { UniqueIdentifier } from "@dnd-kit/core";

type Action =
  | { type: "ADD_ELEMENT"; payload: Omit<LocalElementType, "id"> }
  | {
      type: "UPDATE_ELEMENT";
      payload: { id: UniqueIdentifier; updates: Partial<LocalElementType> };
    }
  | { type: "DELETE_ELEMENT"; payload: { id: UniqueIdentifier } }
  | {
      type: "REORDER_ELEMENT";
      payload: { newOrder: UniqueIdentifier[] };
    }
  | {
      type: "UPDATE_ELEMENT_CONTENT";
      payload: { id: UniqueIdentifier; content: string };
    }
  | {
      type: "UPDATE_ELEMENT_POSITION";
      payload: { id: UniqueIdentifier; position: Position };
    }
  | {
      type: "RESIZE_ELEMENT";
      payload: { id: UniqueIdentifier; height: number };
    }
  | { type: "SELECTED_ELEMENT"; payload: UniqueIdentifier | null };

interface ElementContextType {
  // 当前所有元素的数组
  elements: LocalElementType[];
  // 当前选中的元素，可能是 null
  selectedElement: LocalElementType | null;
  // 设置当前选中的元素
  setSelectedElement: (element: LocalElementType | null) => void;
  // 通过 ID 设置当前选中的元素
  setSelectedElementId: (id: UniqueIdentifier | null) => void;
  // 添加新元素，元素对象不包含 ID
  addElement: (element: Omit<LocalElementType, "id">) => void;
  // 更新指定 ID 的元素
  updateElement: (
    id: UniqueIdentifier,
    updates: Partial<LocalElementType>
  ) => void;
  // 更新当前选中的元素
  updateSelectedElement: (
    update:
      | LocalElementType
      | ((prev: LocalElementType | null) => LocalElementType | null)
  ) => void;
  // 更新指定 ID 元素的内容
  updateElementContent: (id: UniqueIdentifier, content: string) => void;
  // 删除指定 ID 的元素
  deleteElement: (id: UniqueIdentifier) => void;
  // 重新排序元素
  reorderElement: (newOrder: UniqueIdentifier[]) => void;
  // 更新指定 ID 元素的位置
  updateElementPosition: (id: UniqueIdentifier, position: Position) => void;
  // 调整指定 ID 元素的高度
  resizeElement: (id: UniqueIdentifier, height: number) => void;
}

const elementReducer = (
  state: LocalElementType[],
  action: Action
): LocalElementType[] => {
  console.log("Current State:", state);
  console.log("Action Dispatched:", action);

  switch (action.type) {
    case "ADD_ELEMENT":
      const addedElement = {
        id: uuidv4(),
        ...action.payload,
      } as LocalElementType;
      console.log("Adding Element:", addedElement);
      return [...state, addedElement];
    case "UPDATE_ELEMENT":
      return state.map((element) =>
        element.id === action.payload.id
          ? ({ ...element, ...action.payload.updates } as LocalElementType)
          : element
      );
    case "UPDATE_ELEMENT_CONTENT":
      return state.map((element) =>
        element.id === action.payload.id
          ? { ...element, content: action.payload.content }
          : element
      );
    case "UPDATE_ELEMENT_POSITION":
      return state.map((element) =>
        element.id === action.payload.id && !element.isLayout
          ? ({
              ...element,
              position: action.payload.position,
            } as FreeDraggableElementData)
          : element
      );
    case "DELETE_ELEMENT":
      return state.filter((element) => element.id !== action.payload.id);
    case "REORDER_ELEMENT":
      const { newOrder } = action.payload;
      const layoutElements = state.filter((el) => el.isLayout);
      const otherElements = state.filter((el) => !el.isLayout);

      // 使用新的順序更新布局元素
      const updatedLayoutElements = newOrder
        .map((id) => layoutElements.find((el) => el.id === id))
        .filter((el): el is LayoutElementData => el !== undefined);

      // 合併更新後的布局元素和其他元素
      return [...updatedLayoutElements, ...otherElements];

    case "RESIZE_ELEMENT":
      return state.map((element) =>
        element.id === action.payload.id
          ? { ...element, height: action.payload.height }
          : element
      );
    default:
      return state;
  }
};

const ElementContext = createContext<ElementContextType | undefined>(undefined);

export const ElementProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [elements, dispatch] = useReducer(elementReducer, []);
  const [selectedElement, setSelectedElement] =
    useState<LocalElementType | null>(null);

  // 添加調試日誌
  useEffect(() => {
    console.log("Elements updated:", elements);
  }, [elements]);

  const setSelectedElementId = (id: UniqueIdentifier | null) => {
    if (id === null) {
      setSelectedElement(null);
    } else {
      const element = elements.find((el) => el.id === id);
      setSelectedElement(element || null);
    }
  };

  const updateElement = useCallback(
    (id: UniqueIdentifier, updates: Partial<LocalElementType>) => {
      dispatch({ type: "UPDATE_ELEMENT", payload: { id, updates } });
    },
    []
  );

  const updateElementContent = useCallback(
    (id: UniqueIdentifier, content: string) => {
      dispatch({ type: "UPDATE_ELEMENT_CONTENT", payload: { id, content } });
    },
    []
  );

  const addElement = useCallback((element: Omit<LocalElementType, "id">) => {
    const newElement = { ...element, id: uuidv4() };
    console.log("Adding new element:", newElement);
    dispatch({ type: "ADD_ELEMENT", payload: newElement });
  }, []);

  const deleteElement = useCallback((id: UniqueIdentifier) => {
    dispatch({ type: "DELETE_ELEMENT", payload: { id } });
  }, []);

  const reorderElement = useCallback((newOrder: UniqueIdentifier[]) => {
    dispatch({ type: "REORDER_ELEMENT", payload: { newOrder } });
  }, []);

  const updateElementPosition = useCallback(
    (id: UniqueIdentifier, position: Position) => {
      dispatch({ type: "UPDATE_ELEMENT_POSITION", payload: { id, position } });
    },
    []
  );

  const resizeElement = useCallback((id: UniqueIdentifier, height: number) => {
    dispatch({ type: "RESIZE_ELEMENT", payload: { id, height } });
  }, []);

  // useEffect(() => {
  //   console.log("Current elements state:", elements);
  // }, [elements]);

  const contextValue: ElementContextType = {
    elements,
    selectedElement,
    setSelectedElement,
    setSelectedElementId,
    addElement,
    updateElement,
    updateElementContent,
    deleteElement,
    reorderElement,
    updateElementPosition,
    resizeElement,
  };

  return (
    <ElementContext.Provider value={contextValue}>
      {children}
    </ElementContext.Provider>
  );
};

export const useElementContext = () => {
  const context = useContext(ElementContext);
  if (!context) {
    throw new Error("useElementContext must be used within an ElementProvider");
  }
  return context;
};

export const useElementsDebug = () => {
  const { elements } = useElementContext();
  return elements;
};

// Action creators
export const addElement = (element: Omit<LocalElementType, "id">): Action => ({
  type: "ADD_ELEMENT",
  payload: element,
});

export const updateElementPosition = (
  id: UniqueIdentifier,
  position: Position
): Action => ({
  type: "UPDATE_ELEMENT_POSITION",
  payload: { id, position },
});

export const updateElementContent = (
  id: UniqueIdentifier,
  content: string
): Action => ({
  type: "UPDATE_ELEMENT_CONTENT",
  payload: { id, content },
});

export const deleteElement = (id: UniqueIdentifier): Action => ({
  type: "DELETE_ELEMENT",
  payload: { id },
});

export const resizeElement = (
  id: UniqueIdentifier,
  height: number
): Action => ({
  type: "RESIZE_ELEMENT",
  payload: { id, height },
});
