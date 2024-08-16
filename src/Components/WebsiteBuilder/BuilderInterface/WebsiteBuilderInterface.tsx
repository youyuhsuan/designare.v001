import { ElementConfig } from "./ElementConfigInterface";
import { GlobalElementType } from "./ElementInterface";

export interface WebsiteBuilderState {
  // 全局佈局結構
  layout: {
    sections: Array<{
      id: string;
      type: string;
      order: number;
      // 可以根據需要添加更多屬性
    }>;
  };

  // 網站全局設置
  globalSettings: {
    siteWidth: string;
    canvasHeight: string;
    theme: {
      primaryColor: string;
      secondaryColor: string;
      // ... 其他主題設置
    };
    globalStyles: {
      fontFamily: string;
      fontSize: string;
      // ... 其他全局樣式
    };
  };

  // 元素庫
  elementLibrary: {
    elements: Record<string, GlobalElementType>;
    configs: Record<string, ElementConfig>;
  };

  // 歷史記錄和撤銷/重做功能
  history: {
    past: Array<any>;
    present: any;
    future: Array<any>;
  };

  // 專案元信息
  projectMetadata: {
    name: string;
    createdAt: string;
    lastModified: string;
    collaborators: string[];
  };

  // 發佈狀態
  publishStatus: {
    isPublished: boolean;
    lastPublishedAt: string | null;
    version: string;
  };

  // 用戶偏好設置
  userPreferences: {
    language: string;
    editorSettings: {
      showGrid: boolean;
      snapToGrid: boolean;
      // ... 其他編輯器設置
    };
  };

  // 全局拖拽狀態
  dragAndDrop: {
    currentDraggedElement: string | null;
    dragSource: string | null;
    dragTarget: string | null;
  };

  // 性能相關的全局標誌
  performanceFlags: {
    previewMode: boolean;
    advancedFeaturesEnabled: boolean;
  };
}
