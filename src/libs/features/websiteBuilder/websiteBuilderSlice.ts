import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ElementData {
  id: string;
  content: string;
  height: number;
  type?: string;
}

interface WebsiteBuilderState {
  elements: ElementData[];
  siteWidth: string;
  backgroundColor: string;
}

const initialState: WebsiteBuilderState = {
  elements: [],
  siteWidth: "1200px",
  backgroundColor: "#ffffff",
};

export const websiteBuilderSlice = createSlice({
  name: "websiteBuilder",
  initialState,
  reducers: {
    addElement(state, action: PayloadAction<ElementData>) {
      state.elements.push(action.payload);
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      console.log("State before deletion:", JSON.parse(JSON.stringify(state)));
      console.log("Deleting element with ID:", action.payload);
      state.elements = state.elements.filter((el) => el.id !== action.payload);
      console.log("State after deletion:", JSON.parse(JSON.stringify(state)));
    },
    resizeElement(
      state,
      action: PayloadAction<{ id: string; height: number }>
    ) {
      const { id, height } = action.payload;
      const element = state.elements.find((el) => el.id === id);
      if (element) {
        element.height = height;
      }
    },
    reorderElements(
      state,
      action: PayloadAction<{ oldIndex: number; newIndex: number }>
    ) {
      const { oldIndex, newIndex } = action.payload;
      const element = state.elements[oldIndex];
      state.elements.splice(oldIndex, 1);
      state.elements.splice(newIndex, 0, element);
    },
    setSiteWidth(state, action: PayloadAction<string>) {
      state.siteWidth = action.payload;
    },
    setBackgroundColor(state, action: PayloadAction<string>) {
      state.backgroundColor = action.payload;
    },
  },
});

export const {
  addElement,
  deleteElement,
  resizeElement,
  reorderElements,
  setSiteWidth,
  setBackgroundColor,
} = websiteBuilderSlice.actions;

export default websiteBuilderSlice.reducer;
