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
import { UniqueIdentifier } from "@dnd-kit/core";
import { config } from "node:process";

const getChildrenCount = (elementType: string): number => {
  switch (elementType) {
    case "sidebarLayout":
      return 2;
    case "columnizedLayout":
      return 4;
    case "gridLayout":
      return 9;
    default:
      return 0;
  }
};

interface ElementConfig {
  [key: string]: any;
  children?: ElementConfig[];
}

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
    // 創建新的元素實例
    createElementInstance: (
      state,
      action: PayloadAction<CreateElementPayload>
    ) => {
      const { type, content, isLayout, elementType } = action.payload;
      const id = uuidv4(); // 生成唯一的 ID

      const config = createElementConfig(
        type,
        isLayout,
        elementType,
        state.configs
      ); // 根據配置創建元素配置

      let children: LocalElementType[] = [];

      if (isLayout) {
        const childrenCount = getChildrenCount(elementType as string);
        for (let i = 0; i < childrenCount; i++) {
          const childConfig = createElementConfig(
            type,
            true,
            "layout",
            state.configs
          );

          const childElement: LocalElementType = {
            id: uuidv4(),
            type,
            content: "",
            isLayout: true,
            config: childConfig,
          };
          children.push(childElement);
        }
        config.children = children;
      }

      const newElement: LocalElementType = {
        id,
        type,
        content,
        isLayout,
        config: config,
      };

      state.byId[id] = newElement;
      state.allIds.push(id); // 將元素 ID 添加到 allIds
      state.selectedId = id; // 可選：自動選擇新創建的元素

      console.log("New element added to state:", state.byId[id]);
      console.log("Updated allIds:", state.allIds);
    },
    // 刪除元素實例
    deleteElementInstance: (state, action: PayloadAction<UniqueIdentifier>) => {
      const id = action.payload;
      if (state.byId[id]) {
        delete state.byId[id]; // 刪除 byId 中的元素
        state.allIds = state.allIds.filter((elementId) => elementId !== id); // 從 allIds 中移除元素 ID
        if (state.selectedId === id) {
          state.selectedId = state.allIds[0] || null; // 如果刪除的是選中的元素，則選擇下個元素或設置為 null
        }
      }
    },
    // 設置當前選中的元素
    setSelectedElement: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload; // 設置選中的元素 ID 或 null
    },
    // 更新元素實例
    updateElementInstance: (
      state: { byId: Record<string, LocalElementType> },
      action: PayloadAction<{
        id: string;
        updates: DeepPartial<LocalElementType>;
      }>
    ) => {
      const { id, updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = {
          ...state.byId[id],
          ...updates, // 更新元素的屬性
          config: {
            ...state.byId[id].config,
            ...(updates.config || {}), // 更新元素的配置
          },
        };
      }
    },
  },
});

export const {
  // addElementConfig,
  // updateElementConfig,
  // updateElementInstance,
  // deleteElementInstance,
  createElementInstance,
  updateElementInstance,
  deleteElementInstance,
  setSelectedElement,
} = elementLibrarySlice.actions;

export default elementLibrarySlice.reducer;
