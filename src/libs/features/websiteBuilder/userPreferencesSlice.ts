import {
  EditorSettings,
  DeepPartial,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const userPreferencesSlice = createSlice({
  name: "userPreferences",
  initialState: {
    editorSettings: {
      showGrid: true,
      snapToGrid: true,
    } as EditorSettings,
  },
  reducers: {
    updateEditorSettings: (
      state,
      action: PayloadAction<DeepPartial<EditorSettings>>
    ) => {
      state.editorSettings = { ...state.editorSettings, ...action.payload };
    },
  },
});

export const { updateEditorSettings } = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;
