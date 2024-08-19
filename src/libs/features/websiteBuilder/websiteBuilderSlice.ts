import {
  GlobalElementType,
  WebsiteBuilderState,
  ElementConfig,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ElementInstance {
  id: string;
  type: string;
  [key: string]: any; // For additional properties added dynamically
}

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
  activeElementId: null,
  instances: {},
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
    // 更新 elementLibrary.configs 中某个 elementType 的 property 配置
    // 更新元素库中某种类型元素的属性配置
    updateElementProperty: (
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
    setSiteWidth: (state, action: PayloadAction<string>) => {
      state.globalSettings.siteWidth = action.payload;
    },
    setCanvasHeight: (state, action: PayloadAction<string>) => {
      state.globalSettings.canvasHeight = action.payload;
    },
    setActiveElementId: (state, action: PayloadAction<string | null>) => {
      state.activeElementId = action.payload;
    },
    createElementInstance: (
      state,
      action: PayloadAction<{ id: string; type: string }>
    ) => {
      const { id, type } = action.payload;
      const config = state.elementLibrary.configs[type];
      if (config) {
        const newInstance: ElementInstance = { id, type };
        Object.entries(config).forEach(([key, value]) => {
          (newInstance as any)[key] = value.defaultValue;
        });
        state.instances[id] = newInstance;
      }
    },
    updateElementInstance: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<ElementInstance> }>
    ) => {
      const { id, updates } = action.payload;
      if (state.instances[id]) {
        state.instances[id] = { ...state.instances[id], ...updates };
      }
    },
  },
});

export const {
  addToElementLibrary,
  removeFromElementLibrary,
  updateElementLibraryItem,
  updateElementProperty,
  setSiteWidth,
  setCanvasHeight,
  setActiveElementId,
  createElementInstance,
  updateElementInstance,
} = websiteBuilderSlice.actions;

export default websiteBuilderSlice.reducer;
