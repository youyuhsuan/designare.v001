"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { any } from "zod";

interface Element {
  id: string;
  type: string;
  content: React.ReactNode;
  position: { x: number; y: number };
  isLayout: boolean;
  height: number;
  // 其他屬性...
}

type Action =
  | { type: "ADD_ELEMENT"; payload: Omit<Element, "id"> }
  | {
      type: "UPDATE_ELEMENT";
      payload: { id: string; updates: Partial<Element> };
    }
  | { type: "DELETE_ELEMENT"; payload: { id: string; isLayout: boolean } }
  | { type: "UPDATE_ALL_PROPERTIES"; payload: Partial<Element> }
  | {
      type: "UPDATE_ELEMENT_POSITION";
      payload: { id: string; position: { x: number; y: number } };
    }
  | {
      type: "RESIZE_ELEMENT";
      payload: { id: string; height: number; isLayout: boolean };
    };

interface ElementContextType {
  elements: Element[];
  dispatch: React.Dispatch<Action>;
}

const elementReducer = (state: Element[], action: Action): Element[] => {
  console.log("Reducer action:", action); // Log action for debugging

  switch (action.type) {
    case "ADD_ELEMENT":
      const addedElement = { id: uuidv4(), ...action.payload };
      console.log("Adding element:", addedElement); // Log added element
      return [...state, addedElement];
    case "UPDATE_ELEMENT":
      const updatedElements = state.map((element) =>
        element.id === action.payload.id
          ? { ...element, ...action.payload.updates }
          : element
      );
      console.log("Updated elements:", updatedElements); // Log updated elements
      return updatedElements;
    case "DELETE_ELEMENT":
      const filteredElements = state.filter(
        (element) => element.id !== action.payload.id
      );
      console.log("Deleted element with ID:", action.payload.id); // Log deleted element ID
      return filteredElements;
    case "UPDATE_ALL_PROPERTIES":
      const allUpdatedElements = state.map((element) => ({
        ...element,
        ...action.payload,
      }));
      console.log("All updated elements:", allUpdatedElements); // Log all updated elements
      return allUpdatedElements;
    case "UPDATE_ELEMENT_POSITION":
      const positionUpdatedElements = state.map((element) =>
        element.id === action.payload.id
          ? { ...element, position: action.payload.position }
          : element
      );
      console.log("Position updated elements:", positionUpdatedElements); // Log position updated elements
      return positionUpdatedElements;
    case "RESIZE_ELEMENT":
      const resizedElements = state.map((element) =>
        element.id === action.payload.id
          ? { ...element, height: action.payload.height }
          : element
      );
      console.log("Resized elements:", resizedElements); // Log resized elements
      return resizedElements;
    default:
      const _: never = action;
      console.warn("Unknown action type:", action); // Log unknown action types
      return state;
  }
};

const ElementContext = createContext<ElementContextType | undefined>(undefined);

export const ElementProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [elements, dispatch] = useReducer(elementReducer, []);

  return (
    <ElementContext.Provider value={{ elements, dispatch }}>
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

// Action creators with added console logs
export const updateElementPosition = (
  id: string,
  x: number,
  y: number
): Action => {
  console.log("Action creator: updateElementPosition", { id, x, y }); // Log action creator call
  return {
    type: "UPDATE_ELEMENT_POSITION",
    payload: { id, position: { x, y } },
  };
};

export const resizeElement = (
  id: string,
  height: number,
  isLayout: boolean
): Action => {
  console.log("Action creator: resizeElement", { id, height, isLayout }); // Log action creator call
  return {
    type: "RESIZE_ELEMENT",
    payload: { id, height, isLayout },
  };
};

export const deleteElement = (id: string, isLayout: boolean): Action => {
  console.log("Action creator: deleteElement", { id, isLayout }); // Log action creator call
  return {
    type: "DELETE_ELEMENT",
    payload: { id, isLayout },
  };
};
