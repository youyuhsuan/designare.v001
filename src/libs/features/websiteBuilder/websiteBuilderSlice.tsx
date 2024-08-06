import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ElementData {
  id: string;
  content: string;
  height: number;
  type?: string; // 添加 type 字段以区分不同类型的元素
}

interface WebsiteBuilderState {
  elements: ElementData[];
  siteWidth: string;
  backgroundColor: string;
}

const initialState: WebsiteBuilderState = {
  elements: [
    { id: "header", content: "網站標題", height: 100, type: "header" },
    {
      id: "paragraph",
      content: "這是一個段落。",
      height: 100,
      type: "paragraph",
    },
  ],
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
  resizeElement,
  reorderElements,
  setSiteWidth,
  setBackgroundColor,
} = websiteBuilderSlice.actions;

export default websiteBuilderSlice.reducer;
