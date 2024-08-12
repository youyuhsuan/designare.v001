import {
  GlobalElementType,
  GlobalState,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: GlobalState = {
  elementLibrary: [],
  siteWidth: "1200px",
  canvasHeight: "1200px",
};

export const websiteBuilderSlice = createSlice({
  name: "websiteBuilder",
  initialState,
  reducers: {
    addToElementLibrary: (state, action: PayloadAction<GlobalElementType>) => {
      state.elementLibrary.push(action.payload);
    },
    removeFromElementLibrary: (state, action: PayloadAction<string>) => {
      state.elementLibrary = state.elementLibrary.filter(
        (el) => el.id !== action.payload
      );
    },
    updateElementLibraryItem: (
      state,
      action: PayloadAction<GlobalElementType>
    ) => {
      const index = state.elementLibrary.findIndex(
        (el) => el.id === action.payload.id
      );
      if (index !== -1) {
        state.elementLibrary[index] = action.payload;
      }
    },
    setSiteWidth: (state, action: PayloadAction<string>) => {
      state.siteWidth = action.payload;
    },
    canvasHeight: (state, action: PayloadAction<string>) => {
      state.canvasHeight = action.payload;
    },
  },
});

export const {
  addToElementLibrary,
  removeFromElementLibrary,
  updateElementLibraryItem,
  setSiteWidth,
  canvasHeight,
} = websiteBuilderSlice.actions;

export default websiteBuilderSlice.reducer;
