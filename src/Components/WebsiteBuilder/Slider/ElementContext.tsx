"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  LocalElementType,
  FreeDraggableElementData,
  Position,
} from "../BuilderInterface";

type Action =
  | { type: "ADD_ELEMENT"; payload: Omit<LocalElementType, "id"> }
  | {
      type: "UPDATE_ELEMENT";
      payload: { id: string; updates: Partial<LocalElementType> };
    }
  | { type: "DELETE_ELEMENT"; payload: { id: string } }
  | { type: "REORDER_ELEMENTS"; payload: { activeId: string; overId: string } }
  | { type: "UPDATE_ELEMENT_CONTENT"; payload: { id: string; content: string } }
  | {
      type: "UPDATE_ELEMENT_POSITION";
      payload: { id: string; position: Position };
    }
  | { type: "RESIZE_ELEMENT"; payload: { id: string; height: number } };

interface ElementContextType {
  elements: LocalElementType[];
  addElement: (element: Omit<LocalElementType, "id">) => void;
  updateElement: (id: string, updates: Partial<LocalElementType>) => void;
  updateElementContent: (id: string, content: string) => void;
  deleteElement: (id: string) => void;
  reorderElement: (activeId: string, overId: string) => void;
  updateElementPosition: (id: string, position: Position) => void;
  resizeElement: (id: string, height: number) => void;
}

const elementReducer = (
  state: LocalElementType[],
  action: Action
): LocalElementType[] => {
  switch (action.type) {
    case "ADD_ELEMENT":
      return [
        ...state, //  添加一个新元素到状态数组中
        { id: uuidv4(), ...action.payload } as LocalElementType,
      ];
    case "UPDATE_ELEMENT":
      return state.map((element) =>
        element.id === action.payload.id
          ? ({ ...element, ...action.payload.updates } as LocalElementType)
          : element
      );
    case "DELETE_ELEMENT":
      return state.filter((element) => element.id !== action.payload.id); // filter 方法去掉 ID 匹配的元素，返回不包含该元素的新数组
    case "REORDER_ELEMENTS":
      const { activeId, overId } = action.payload;
      const oldIndex = state.findIndex((el) => el.id === activeId);
      const newIndex = state.findIndex((el) => el.id === overId);
      const newElements = [...state];
      const [reorderedItem] = newElements.splice(oldIndex, 1);
      newElements.splice(newIndex, 0, reorderedItem);
      return newElements;
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

  const addElement = useCallback((element: Omit<LocalElementType, "id">) => {
    dispatch({ type: "ADD_ELEMENT", payload: element });
  }, []);

  const updateElement = useCallback(
    (id: string, updates: Partial<LocalElementType>) => {
      dispatch({ type: "UPDATE_ELEMENT", payload: { id, updates } });
    },
    []
  );

  const updateElementContent = useCallback((id: string, content: string) => {
    dispatch({ type: "UPDATE_ELEMENT_CONTENT", payload: { id, content } });
  }, []);

  const deleteElement = useCallback((id: string) => {
    dispatch({ type: "DELETE_ELEMENT", payload: { id } });
  }, []);

  const reorderElement = useCallback((activeId: string, overId: string) => {
    dispatch({ type: "REORDER_ELEMENTS", payload: { activeId, overId } });
  }, []);

  const updateElementPosition = useCallback(
    (id: string, position: Position) => {
      dispatch({ type: "UPDATE_ELEMENT_POSITION", payload: { id, position } });
    },
    []
  );

  const resizeElement = useCallback((id: string, height: number) => {
    dispatch({ type: "RESIZE_ELEMENT", payload: { id, height } });
  }, []);

  useEffect(() => {
    console.log("Current elements state:", elements);
  }, [elements]);

  const contextValue: ElementContextType = {
    elements,
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
  id: string,
  position: Position
): Action => ({
  type: "UPDATE_ELEMENT_POSITION",
  payload: { id, position },
});

export const updateElementContent = (id: string, content: string): Action => ({
  type: "UPDATE_ELEMENT_CONTENT",
  payload: { id, content },
});

export const deleteElement = (id: string): Action => ({
  type: "DELETE_ELEMENT",
  payload: { id },
});

export const resizeElement = (id: string, height: number): Action => ({
  type: "RESIZE_ELEMENT",
  payload: { id, height },
});
