import {
  GlobalSettingsState,
  DeepPartial,
  LayoutSettings,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: GlobalSettingsState = {
  desktop: {
    siteWidth: "1200px",
    canvasHeight: "1200px",
  },
  tablet: {
    siteWidth: "768px",
    canvasHeight: "1024px",
  },
  mobile: {
    siteWidth: "360px",
    canvasHeight: "640px",
  },
  currentDevice: "desktop",
  canvasOffset: { x: 0, y: 0 },
};

export const globalSettingsSlice = createSlice({
  name: "globalSettings",
  initialState,
  reducers: {
    setLayoutSettings: (
      state,
      action: PayloadAction<{
        device: "desktop" | "tablet" | "mobile";
        settings: DeepPartial<LayoutSettings>;
      }>
    ) => {
      const { device, settings } = action.payload;
      state[device] = { ...state[device], ...settings };
    },
    setCurrentDevice: (
      state,
      action: PayloadAction<"desktop" | "tablet" | "mobile">
    ) => {
      state.currentDevice = action.payload;
    },
    setCanvasOffset: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.canvasOffset = action.payload;
    },
  },
});

export const { setLayoutSettings, setCurrentDevice } =
  globalSettingsSlice.actions;

export default globalSettingsSlice.reducer;
