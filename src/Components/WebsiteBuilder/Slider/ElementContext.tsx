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
  const [selectedPath, setSelectedPath] = useState<UniqueIdentifier[]>([]);
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

  // 定義一個用於查找指定 ID 元素及其路徑的回調函數
  const findElementWithPath = useCallback(
    (
      targetId: string, // 目標元素的 ID
      currentPath: string[] = [] // 當前路徑，默認為空數組
    ): [LocalElementType | null, string[]] => {
      // 定義一個內部函數，用於在給定的元素數組中查找目標元素
      const findInElements = (
        els: LocalElementType[] // 要查找的元素數組
      ): [LocalElementType | null, string[]] => {
        // 遍歷所有元素
        for (const element of els) {
          if (element.id === targetId) {
            console.log("找到匹配的 ID，返回該元素及其路徑:", {
              element,
              path: [...currentPath, element.id],
            });
            // 如果找到匹配的 ID，返回該元素及其路徑
            return [element, [...currentPath, element.id]];
          }
          // 如果元素有子元素，遞迴查找子元素
          if (element.config && Array.isArray(element.config.children)) {
            console.log("元素具有子元素，遞迴查找子元素");
            const [foundElement, foundPath] = findInElements(
              element.config.children // 查找子元素
            );
            if (foundElement) {
              // 如果在子元素中找到匹配的元素，返回該元素及其完整路徑
              console.log("在子元素中找到匹配的元素，返回該元素及其完整路徑:", {
                foundElement,
                path: [...currentPath, element.id, ...foundPath],
              });
              return [foundElement, [...currentPath, element.id, ...foundPath]];
            }
          }
        }
        // 如果沒有找到，返回 null 和空路徑
        console.log("未找到匹配的元素，返回 null 和空路徑");
        return [null, []];
      };

      // 使用 findInElements 函數在根元素數組中查找目標元素
      return findInElements(elements);
    },
    [elements] // 依賴項，當 elements 改變時，函數會重新創建
  );

  // 定義一個處理元素選擇的回調函數
  const handleElementSelect = useCallback(
    ({ id, path }: { id: string | null; path?: string[] }) => {
      console.log("handleElementSelect 被調用，元素 ID:", id);

      if (id === null) {
        // 處理取消選擇的情況
        setSelectedElement(null); // 重置選中的元素為 null
        setSelectedPath([]); // 清空選中的路徑
        console.log("取消選擇元素");
        return; // 返回，結束函數執行
      }

      let selectedEl: LocalElementType | null;
      let selectedPth: string[];

      if (path) {
        // 如果提供了路徑，直接使用該路徑
        selectedPth = path; // 設置選中的路徑
        // 查找指定 ID 的元素，使用 path 來定位元素
        [selectedEl] = findElementWithPath(id);
        console.log("使用提供的路徑查找元素:", {
          selectedEl,
          path: selectedPth,
        });
      } else {
        // 如果沒有提供路徑，使用 findElementWithPath 查找元素
        [selectedEl, selectedPth] = findElementWithPath(id);
        console.log("使用 findElementWithPath 查找元素:", {
          selectedEl,
          path: selectedPth,
        });
      }

      if (selectedEl) {
        // 如果找到元素，更新選中的元素和路徑
        setSelectedElement(selectedEl); // 設置選中的元素
        setSelectedPath(selectedPth); // 設置選中的路徑
        console.log("找到元素，更新選中的元素和路徑:", {
          selectedEl,
          path: selectedPth,
        });
      } else {
        // 如果未找到元素，重置選中的元素和路徑
        console.warn(`ID 為 ${id} 的元素在元素樹中未找到`);
        setSelectedElement(null); // 重置選中的元素為 null
        setSelectedPath([]); // 清空選中的路徑
      }
    },
    [findElementWithPath] // 當 findElementWithPath 函數變化時，更新該回調函數
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
    addElement,
    updateElement,
    updateElementProperty,
    updateSelectedElement,
    handleElementSelect,
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
