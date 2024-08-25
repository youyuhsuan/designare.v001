import {
  ElementLibrary,
  CreateElementPayload,
  LocalElementType,
  ElementInstance,
  DeepPartial,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { createElementConfig } from "@/src/Components/WebsiteBuilder/createElementConfig";
import { elementConfigs } from "@/src/Components/WebsiteBuilder/SidebarEditor/elementConfigs";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export const elementLibrarySlice = createSlice({
  name: "elementLibrary",
  initialState: {
    byId: {},
    allIds: [],
    selectedId: null,
    configs: elementConfigs,
  } as ElementLibrary,
  reducers: {
    // 新的默認樣式
    // addElementConfig: (state, action: PayloadAction<ElementConfig>) => {
    //   state.elements[action.payload.type] = action.payload;
    // },
    // updateElementConfig: (
    //   state,
    //   action: PayloadAction<{
    //     type: string;
    //     config: DeepPartial<ElementConfig>;
    //   }>
    // ) => {
    //   const { type, config } = action.payload;
    //   if (!state.elements[type]) {
    //     state.elements[type] = {
    //       type: config.type || type,
    //       label: config.label || "",
    //       properties: {},
    //     };
    //   }

    //   if (config.label) {
    //     state.elements[type].label = config.label;
    //   }

    //   if (config.properties) {
    //     Object.keys(config.properties).forEach((propKey) => {
    //       if (config.properties![propKey]) {
    //         state.elements[type].properties[propKey] = {
    //           ...state.elements[type].properties[propKey],
    //           ...config.properties![propKey],
    //         };
    //       }
    //     });
    //   }
    // },
    createElementInstance: (
      state,
      action: PayloadAction<CreateElementPayload>
    ) => {
      const { type, content, isLayout, elementType } = action.payload;
      const id = uuidv4();
      const config = createElementConfig(
        type,
        isLayout,
        elementType,
        state.configs
      );
      const newElement: LocalElementType = {
        id,
        type,
        content,
        isLayout,
        config: config, // 初始配置，可以根据 elementType 设置不同的默认值
      };
      state.byId[id] = newElement;
      state.allIds.push(id);
      state.selectedId = id; // 可选：自动选择新创建的元素
    },
    updateElementInstance: (
      state,
      action: PayloadAction<{
        id: string;
        updates: DeepPartial<ElementInstance>;
      }>
    ) => {
      const { id, updates } = action.payload;
      state.instances[id] = { ...state.instances[id], ...updates };
    },
    deleteElementInstance: (state, action: PayloadAction<string>) => {
      delete state.instances[action.payload];
    },
  },
});

export const {
  // addElementConfig,
  // updateElementConfig,
  createElementInstance,
  // updateElementInstance,
  // deleteElementInstance,
} = elementLibrarySlice.actions;

export default elementLibrarySlice.reducer;
