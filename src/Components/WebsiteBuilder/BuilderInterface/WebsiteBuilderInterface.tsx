import { ElementConfig } from "./ElementConfigInterface";
import { LocalElementType } from "./ElementInterface";
// import { GlobalElementType } from "./ElementInterface";

export interface LayoutSettings {
  siteWidth: string;
  canvasHeight: string;
}

// 網站全局設置
export interface GlobalSettingsState {
  desktop: LayoutSettings;
  tablet: LayoutSettings;
  mobile: LayoutSettings;
  currentDevice: "desktop" | "tablet" | "mobile";
}

// 對象類型 `T` 的所有屬性及其嵌套屬性變成可選
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface EditorSettings {
  showGrid: boolean;
  snapToGrid: boolean;
}

// Elements
export interface ElementsState {
  byId: Record<string, LocalElementType>;
  allIds: string[];
  selectedId: string | null;
  configs: any;
}

export interface ElementInstance {
  id: string;
  type: string;
  content: string;
  isLayout: boolean;
  config: any;
}

// Toolbar 創造 Instance
export interface CreateElementPayload {
  type: string;
  content: string;
  isLayout: boolean;
  elementType?: string;
}

// export interface WebsiteBuilderState {
//   // 網站全局設置
//   globalSettings: {
//     desktop: LayoutSettings;
//     tablet: LayoutSettings;
//     mobile: LayoutSettings;
//     currentDevice: "desktop" | "tablet" | "mobile";
//   };

//   // 元素庫
//   elementLibrary: {
//     elements: { [id: string]: GlobalElementType };
//     configs: { [elementType: string]: { [property: string]: ElementConfig } };
//   };

//   // 歷史記錄和撤銷/重做功能
//   history: {
//     past: any[]; // 考虑为历史记录定义一个更具体的类型
//     present: any | null;
//     future: any[];
//   };

//   // 專案元信息
//   websiteMetadata: {
//     name: string;
//     createdAt: string;
//     lastModified: string;
//   };

//   // 發佈狀態
//   publishStatus: {
//     isPublished: boolean;
//     lastPublishedAt: string | null;
//     version: string;
//   };

//   // 用戶偏好設置
//   userPreferences: {
//     editorSettings: {
//       showGrid: boolean;
//       snapToGrid: boolean;
//     };
//   };

//   // 全局拖拽狀態
//   dragAndDrop: {
//     currentDraggedElement: any | null;
//     dragSource: any | null;
//     dragTarget: any | null;
//   };

//   // 性能相關的全局標誌
//   performanceFlags: {
//     previewMode: boolean;
//     advancedFeaturesEnabled: boolean;
//   };
//   activeElementId: string | null;
//   instances: { [id: string]: any };
// }
