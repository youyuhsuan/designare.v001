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
  ElementContextType,
  Action,
} from "@/src/Components/WebsiteBuilder/BuilderInterface/index";
import { UniqueIdentifier } from "@dnd-kit/core";

// 遞歸遍歷嵌套對象的屬性路徑
export const updateNestedProperty = (
  obj: any,
  path: string[],
  value: any
): any => {
  const [head, ...rest] = path;
  if (rest.length === 0) {
    return { ...obj, [head]: value };
  }
  return {
    ...obj,
    [head]: updateNestedProperty(obj[head] || {}, rest, value),
  };
};

// 處理狀態更新操作的 reducer，實際執行更新邏輯
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
      // console.log("Adding Element:", addedElement);
      return [...state, addedElement];

    case "UPDATE_ELEMENT":
      return state.map((element) =>
        element.id === action.payload.id
          ? ({ ...element, ...action.payload.updates } as LocalElementType)
          : element
      );

    // 所有元素的属性更新，通常在整个元素库或所有元素的上下文中使用
    case "UPDATE_ELEMENT_PROPERTY":
      return state.map((element) => {
        // 是否当前元素是需要更新的元素
        if (element.id !== action.payload.id) {
          return element;
        }
        const { propertyPath, value } = action.payload;
        const pathParts = propertyPath.split(".");
        return updateNestedProperty(element, pathParts, value);
      });

    // 特定的選中元素的属性更新
    case "UPDATE_SELECTED_ELEMENT":
      return state.map((element) => {
        if (element.id !== action.payload.id) {
          return element;
        }
        const { propertyPath, value } = action.payload;
        const pathParts = propertyPath.split(".");

        return updateNestedProperty(element, pathParts, value);
      });

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

// 管理狀態和提供上下文
export const ElementProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [elements, dispatch] = useReducer(elementReducer, []);
  const [selectedElement, setSelectedElement] =
    useState<LocalElementType | null>(null);

  // Debug
  useEffect(() => {
    console.log("Elements updated:", elements);
  }, [elements]);

  useEffect(() => {
    console.log("Current elements state:", elements);
  }, [elements]);

  // ID 設置當前選中的元素
  const setSelectedElementId = (id: UniqueIdentifier | null) => {
    if (id === null) {
      setSelectedElement(null);
    } else {
      const element = elements.find((el) => el.id === id);
      setSelectedElement(element || null);
    }
  };

  // 添加新元素，元素不包含 ID
  const addElement = useCallback((element: Omit<LocalElementType, "id">) => {
    const newElement = { ...element, id: uuidv4() };
    // console.log("Adding new element:", newElement);
    dispatch({ type: "ADD_ELEMENT", payload: newElement });
  }, []);

  // 更新指定 ID 的元素
  const updateElement = useCallback(
    (id: UniqueIdentifier, updates: Partial<LocalElementType>) => {
      dispatch({ type: "UPDATE_ELEMENT", payload: { id, updates } });
    },
    []
  );

  // 所有元素的属性更新，通常在整个元素库或所有元素的上下文中使用
  const updateElementProperty = useCallback(
    (id: UniqueIdentifier, propertyPath: string, value: any) => {
      dispatch({
        type: "UPDATE_ELEMENT_PROPERTY",
        payload: { id, propertyPath, value },
      });
    },
    []
  );

  const updateSelectedElement = useCallback(
    (id: UniqueIdentifier, propertyPath: string, value: any) => {
      dispatch({
        type: "UPDATE_SELECTED_ELEMENT",
        payload: { id, propertyPath, value },
      });
    },
    []
  );

  // 刪除指定 ID 的元素
  const deleteElement = useCallback((id: UniqueIdentifier) => {
    dispatch({ type: "DELETE_ELEMENT", payload: { id } });
  }, []);

  // 重新排序元素
  const reorderElement = useCallback((newOrder: UniqueIdentifier[]) => {
    dispatch({ type: "REORDER_ELEMENT", payload: { newOrder } });
  }, []);

  // 更新指定 ID 元素的位置
  const updateElementPosition = useCallback(
    (id: UniqueIdentifier, position: Position) => {
      dispatch({ type: "UPDATE_ELEMENT_POSITION", payload: { id, position } });
    },
    []
  );

  //  調整指定 ID 元素的高度
  const resizeElement = useCallback((id: UniqueIdentifier, height: number) => {
    dispatch({ type: "RESIZE_ELEMENT", payload: { id, height } });
  }, []);

  const contextValue: ElementContextType = {
    elements,
    selectedElement,
    setSelectedElement,
    setSelectedElementId,
    addElement,
    updateElement,
    updateElementProperty,
    updateSelectedElement,
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

// Debug
export const useElementsDebug = () => {
  const { elements } = useElementContext();
  // console.log("Current elements:", elements);
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
