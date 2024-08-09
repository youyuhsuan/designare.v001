import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Position {
  x: number;
  y: number;
}

interface BaseElementData {
  id: string;
  content: string;
  type: string;
  height: number;
}

export interface LayoutElementData extends BaseElementData {
  isLayout: true;
}

export interface FreeDraggableElementData extends BaseElementData {
  // isLayout: false;
  position: Position;
}

export type ElementData = LayoutElementData | FreeDraggableElementData;

interface ElementLibraryItem {
  id: string;
  type: string;
  defaultProperties: Record<string, any>;
}

interface WebsiteBuilderState {
  layoutElements: LayoutElementData[];
  freeDraggableElements: FreeDraggableElementData[];
  siteWidth: string;
  activeElementId: string | null;
  elementsLibrary: ElementLibraryItem[];
}

const initialState: WebsiteBuilderState = {
  layoutElements: [],
  freeDraggableElements: [],
  siteWidth: "1200px",
  activeElementId: null,
  elementsLibrary: [],
};

export const websiteBuilderSlice = createSlice({
  name: "websiteBuilder",
  initialState,
  reducers: {
    addLayoutElement: (state, action: PayloadAction<LayoutElementData>) => {
      state.layoutElements.push(action.payload);
    },
    addFreeDraggableElement: (
      state,
      action: PayloadAction<Omit<FreeDraggableElementData, "position">>
    ) => {
      const viewport = document.getElementById("viewport");
      const selection = window.getSelection();
      let centerX, centerY;

      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      } else if (viewport) {
        const rect = viewport.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      } else {
        centerX = window.innerWidth / 2;
        centerY = window.innerHeight / 2;
      }

      const newElement: FreeDraggableElementData = {
        ...action.payload,
        position: { x: centerX, y: centerY },
      };

      state.freeDraggableElements.push(newElement);
    },
    deleteElement: (
      state,
      action: PayloadAction<{ id: string; isLayout: boolean }>
    ) => {
      if (action.payload.isLayout) {
        state.layoutElements = state.layoutElements.filter(
          (el) => el.id !== action.payload.id
        );
      } else {
        state.freeDraggableElements = state.freeDraggableElements.filter(
          (el) => el.id !== action.payload.id
        );
      }
    },
    resizeElement: (
      state,
      action: PayloadAction<{ id: string; height: number; isLayout: boolean }>
    ) => {
      const elements = action.payload.isLayout
        ? state.layoutElements
        : state.freeDraggableElements;
      const element = elements.find((el) => el.id === action.payload.id);
      if (element) {
        element.height = action.payload.height;
      }
    },
    updateFreeDraggableElementPosition: (
      state,
      action: PayloadAction<{ id: string; position: Position }>
    ) => {
      const element = state.freeDraggableElements.find(
        (el) => el.id === action.payload.id
      );
      if (element) {
        element.position = action.payload.position;
      }
    },
    reorderLayoutElements: (
      state,
      action: PayloadAction<{ oldIndex: number; newIndex: number }>
    ) => {
      const { oldIndex, newIndex } = action.payload;
      const [reorderedItem] = state.layoutElements.splice(oldIndex, 1);
      state.layoutElements.splice(newIndex, 0, reorderedItem);
    },
    setSiteWidth: (state, action: PayloadAction<string>) => {
      state.siteWidth = action.payload;
    },
    setActiveElement: (state, action: PayloadAction<string | null>) => {
      state.activeElementId = action.payload;
    },
    addElementToLibrary: (state, action: PayloadAction<ElementLibraryItem>) => {
      state.elementsLibrary.push(action.payload);
    },
    removeElementFromLibrary: (state, action: PayloadAction<string>) => {
      state.elementsLibrary = state.elementsLibrary.filter(
        (item) => item.id !== action.payload
      );
    },
    updateElementInLibrary: (
      state,
      action: PayloadAction<ElementLibraryItem>
    ) => {
      const index = state.elementsLibrary.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.elementsLibrary[index] = action.payload;
      }
    },
  },
});

export const {
  addLayoutElement,
  addFreeDraggableElement,
  deleteElement,
  resizeElement,
  updateFreeDraggableElementPosition,
  reorderLayoutElements,
  setSiteWidth,
  setActiveElement,
} = websiteBuilderSlice.actions;

export default websiteBuilderSlice.reducer;
