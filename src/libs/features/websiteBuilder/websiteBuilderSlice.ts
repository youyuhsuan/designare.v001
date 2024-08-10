import {
  ElementData,
  FreeDraggableElementData,
  Position,
  WebsiteBuilderState,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: WebsiteBuilderState = {
  elements: [],
  siteWidth: "1200px",
  activeElementId: null,
};

export const websiteBuilderSlice = createSlice({
  name: "websiteBuilder",
  initialState,
  reducers: {
    addElement: (state, action: PayloadAction<ElementData>) => {
      state.elements.push(action.payload);
    },
    updateElementPosition: (
      state,
      action: PayloadAction<{ id: string; position: Position }>
    ) => {
      const element = state.elements.find(
        (el): el is FreeDraggableElementData =>
          el.id === action.payload.id && !el.isLayout
      );
      if (element) {
        element.position = action.payload.position;
      }
    },
    updateElementContent: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      const element = state.elements.find((el) => el.id === action.payload.id);
      if (element) {
        element.content = action.payload.content;
      }
    },
    setActiveElement: (state, action: PayloadAction<string | null>) => {
      state.activeElementId = action.payload;
    },
    setSiteWidth: (state, action: PayloadAction<string>) => {
      state.siteWidth = action.payload;
    },
  },
});

export const {
  addElement,
  updateElementPosition,
  updateElementContent,
  setActiveElement,
  setSiteWidth,
} = websiteBuilderSlice.actions;

export default websiteBuilderSlice.reducer;
