import {
  GlobalElementType,
  WebsiteBuilderState,
  ElementConfig,
  BaseElementData,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: WebsiteBuilderState = {
  layout: {
    sections: [],
  },
  globalSettings: {
    siteWidth: "1200px",
    canvasHeight: "1200px",
    theme: {
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
    },
    globalStyles: {
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
    },
  },
  elementLibrary: {
    elements: {},
    configs: {},
  },
  history: {
    past: [],
    present: null,
    future: [],
  },
  projectMetadata: {
    name: "New Project",
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    collaborators: [],
  },
  publishStatus: {
    isPublished: false,
    lastPublishedAt: null,
    version: "0.0.1",
  },
  userPreferences: {
    language: "en",
    editorSettings: {
      showGrid: true,
      snapToGrid: true,
    },
  },
  dragAndDrop: {
    currentDraggedElement: null,
    dragSource: null,
    dragTarget: null,
  },
  performanceFlags: {
    previewMode: false,
    advancedFeaturesEnabled: false,
  },
  instances: {},
  activeElementId: null,
};

export const websiteBuilderSlice = createSlice({
  name: "websiteBuilder",
  initialState,
  reducers: {
    addToElementLibrary: (state, action: PayloadAction<GlobalElementType>) => {
      state.elementLibrary.elements[action.payload.id] = action.payload;
    },
    removeFromElementLibrary: (state, action: PayloadAction<string>) => {
      delete state.elementLibrary.elements[action.payload];
    },
    updateElementLibraryItem: (
      state,
      action: PayloadAction<GlobalElementType>
    ) => {
      state.elementLibrary.elements[action.payload.id] = action.payload;
    },
    updateElementConfig: (
      state,
      action: PayloadAction<{
        elementType: string;
        property: string;
        config: Partial<ElementConfig>;
      }>
    ) => {
      const { elementType, property, config } = action.payload;
      if (state.elementLibrary.configs[elementType]) {
        state.elementLibrary.configs[elementType] = {
          ...state.elementLibrary.configs[elementType],
          [property]: {
            ...state.elementLibrary.configs[elementType][property],
            ...config,
          },
        };
      }
    },
    createElementInstance: (
      state,
      action: PayloadAction<{ id: string; type: string }>
    ) => {
      const { id, type } = action.payload;
      const config = state.elementLibrary.configs[type];
      if (config) {
        state.instances[id] = { id, type } as BaseElementData;
        // 將配置中的默認值應用到實例
        Object.entries(config).forEach(([key, value]) => {
          (state.instances[id] as any)[key] = value.defaultValue;
        });
      }
    },
    updateElementInstance: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<BaseElementData> }>
    ) => {
      const { id, updates } = action.payload;
      if (state.instances[id]) {
        state.instances[id] = { ...state.instances[id], ...updates };
      }
    },
    setSiteWidth: (state, action: PayloadAction<string>) => {
      state.globalSettings.siteWidth = action.payload;
    },
    setCanvasHeight: (state, action: PayloadAction<string>) => {
      state.globalSettings.canvasHeight = action.payload;
    },
    setActiveElementId: (state, action: PayloadAction<string | null>) => {
      state.activeElementId = action.payload;
    },
    // 可以根據需要添加更多 reducer
  },
});

export const {
  addToElementLibrary,
  removeFromElementLibrary,
  updateElementLibraryItem,
  updateElementConfig,
  createElementInstance,
  updateElementInstance,
  setSiteWidth,
  setCanvasHeight,
  setActiveElementId,
} = websiteBuilderSlice.actions;

export default websiteBuilderSlice.reducer;
