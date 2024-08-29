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
import { isEqual } from "lodash";
import { UniqueIdentifier } from "@dnd-kit/core";
import {
  LocalElementType,
  Position,
  LayoutElementData,
  FreeDraggableElementData,
  ElementContextType,
  Action,
} from "@/src/Components/WebsiteBuilder/BuilderInterface/index";
import { useAppDispatch, useAppSelector } from "@/src/libs/hook";
import { selectElementInstances } from "@/src/libs/features/websiteBuilder/elementLibrarySelector";
import { updateElementLibrary } from "@/src/libs/features/websiteBuilder/websiteMetadataThunk";
import { updateNestedProperty } from "@/src/utilities/updateNestedProperty";
import { deleteElementInstance } from "@/src/libs/features/websiteBuilder/elementLibrarySlice";

// elementReducer
// 處理各種狀態更新操作

// ElementContext ElementProvider
// 提供和管理元素狀態，並向子組件提供上下文

// useElementContext
// 提供上下文的 hook

// Action Creators
// 創建不同的 Redux 動作

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
          ? {
              ...element,
              config: {
                ...element.config,
                position: action.payload.config.position,
              },
            }
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
    case "SET_ELEMENTS":
      return action.payload;
    default:
      return state;
  }
};

// 創建 ElementContext 用於狀態管理
const ElementContext = createContext<ElementContextType | undefined>(undefined);

// ElementProvider 組件，提供狀態和功能給子組件
export const ElementProvider: React.FC<{
  children: React.ReactNode;
  websiteId: string;
}> = ({ children, websiteId }) => {
  const [elements, localDispatch] = useReducer(elementReducer, []);
  const [selectedElement, setSelectedElement] =
    useState<LocalElementType | null>(null);
  const reduxElements = useAppSelector(selectElementInstances);
  const reduxDispatch = useAppDispatch();

  useEffect(() => {
    console.log("Syncing Redux elements to local state:", reduxElements);
    localDispatch({
      type: "SET_ELEMENTS",
      payload: Object.values(reduxElements),
    });
  }, [reduxElements]);

  useEffect(() => {
    console.log("Syncing local state to Redux:", elements);
    // ... 现有的代码 ...
  }, [elements, reduxElements, reduxDispatch, websiteId]);

  // 同步 Redux 元素到本地狀態
  useEffect(() => {
    localDispatch({
      type: "SET_ELEMENTS",
      payload: Object.values(reduxElements),
    });
  }, [reduxElements]);

  // 同步本地狀態到 Redux
  useEffect(() => {
    const elementsObject = elements.reduce((acc, element) => {
      acc[element.id] = element;
      return acc;
    }, {} as Record<string, LocalElementType>);

    if (!isEqual(elementsObject, reduxElements)) {
      reduxDispatch(
        updateElementLibrary({
          websiteId,
          updates: { byId: elementsObject },
          deletedIds: Object.keys(reduxElements).filter(
            (id) => !elementsObject[id]
          ),
        })
      );
    }
  }, [elements, reduxElements, reduxDispatch, websiteId]);

  // Debug 日誌
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Elements updated:", elements);
    }
  }, [elements]);

  const setSelectedElementId = useCallback(
    (id: UniqueIdentifier | null) => {
      if (id === null) {
        setSelectedElement(null);
      } else {
        const element = elements.find((el) => el.id === id);
        setSelectedElement(element || null);
      }
    },
    [elements]
  );

  const addElement = useCallback((element: Omit<LocalElementType, "id">) => {
    const newElement = { ...element, id: uuidv4() };
    localDispatch({ type: "ADD_ELEMENT", payload: newElement });
  }, []);

  const updateElement = useCallback(
    (id: UniqueIdentifier, updates: Partial<LocalElementType>) => {
      localDispatch({ type: "UPDATE_ELEMENT", payload: { id, updates } });
      reduxDispatch(
        updateElementLibrary({
          websiteId,
          updates: { [id]: updates },
          deletedIds: [],
        })
      );
    },
    [reduxDispatch, websiteId]
  );

  const updateElementProperty = useCallback(
    (id: UniqueIdentifier, propertyPath: string, value: any) => {
      localDispatch({
        type: "UPDATE_ELEMENT_PROPERTY",
        payload: { id, propertyPath, value },
      });
    },
    []
  );

  const updateSelectedElement = useCallback(
    (id: UniqueIdentifier, propertyPath: string, value: any) => {
      localDispatch({
        type: "UPDATE_SELECTED_ELEMENT",
        payload: { id, propertyPath, value },
      });
    },
    []
  );

  const deleteElement = useCallback(
    (id: UniqueIdentifier) => {
      localDispatch({ type: "DELETE_ELEMENT", payload: { id } });
      reduxDispatch(deleteElementInstance(id));
      console.log(`Element ${id} has been deleted`);
    },
    [reduxDispatch]
  );

  const reorderElement = useCallback((newOrder: UniqueIdentifier[]) => {
    localDispatch({ type: "REORDER_ELEMENT", payload: { newOrder } });
  }, []);

  const updateElementPosition = useCallback(
    (id: UniqueIdentifier, config: { position: Position }) => {
      localDispatch({
        type: "UPDATE_ELEMENT_POSITION",
        payload: { id, config },
      });
    },
    []
  );

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
  console.log("Current elements:", elements);
  return elements;
};

// Action creators
export const addElement = (element: Omit<LocalElementType, "id">): Action => ({
  type: "ADD_ELEMENT",
  payload: element,
});

export const updateElementPosition = (
  id: UniqueIdentifier,
  config: { position: Position }
): Action => ({
  type: "UPDATE_ELEMENT_POSITION",
  payload: { id, config },
});

export const deleteElement = (id: UniqueIdentifier): Action => ({
  type: "DELETE_ELEMENT",
  payload: { id },
});
