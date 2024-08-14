import { UniqueIdentifier } from "@dnd-kit/core";
import { ReactNode } from "react";

export interface SiteContainerProps {
  width?: string;
  height?: string;
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export interface SectionWrapperProps {
  $isDragging?: boolean;
  isSelected?: boolean;
}

// 基础类型
export interface Position {
  x: number;
  y: number;
}

// 基础元素数据接口
export interface BaseElementData {
  id: string;
  type: string;
  content: string;
  height: number;
  isDragging?: boolean;
  [key: string]: any;
}

// 全局元素类型
export interface GlobalElementType extends BaseElementData {
  isLayout: boolean;
  defaultProps: {
    position?: Position;
  };
}

// 全局状态
// export interface GlobalState {
//   elementLibrary: GlobalElementType[];
//   siteWidth: string;
//   canvasHeight: string;
//   configs: Record<string, ElementConfig>; // 配置元素類型的詳細設置
//   instances: Record<string, any>; // 元素實例的狀態
// }

// 局部元素类型
export type LocalElementType = LayoutElementData | FreeDraggableElementData;

// 布局元素数据接口
export interface LayoutElementData extends BaseElementData {
  children?: UniqueIdentifier[];
  isLayout: true;
}

// 自由拖动元素数据接口
export interface FreeDraggableElementData extends BaseElementData {
  isLayout: false;
  position: Position;
  zIndex?: number;
}

// 元素回调接口
export interface ElementCallbacks {
  onUpdate: (updates: Partial<LocalElementType>) => void; // 更新元素时调用的函数，接受部分属性更新
  onDelete: () => void;
  isSelected?: boolean; // 可选，指示元素是否被选中
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void; // 点击元素时调用的函数
}

// 布局元素属性接口（包含回调）
export type LayoutElementProps = LayoutElementData & ElementCallbacks;

// 自由拖动元素属性接口（包含回调）
export type FreeDraggableElementProps = FreeDraggableElementData &
  ElementCallbacks;

// 布局元素属性接口（含拖动状态）
export interface LayoutProps extends LayoutElementData, ElementCallbacks {
  key: string;
  isDragging?: boolean;
}

// 自由拖动元素属性接口（含拖动状态）
export interface FreeDraggableProps
  extends FreeDraggableElementData,
    ElementCallbacks {
  key: string;
  isDragging?: boolean;
}

// SidebarEditor
export interface PropertyConfig {
  label: string; // 屬性的顯示名稱
  type:
    | "text"
    | "number"
    | "checkbox"
    | "select"
    | "color"
    | "custom"
    | "object"
    | "composite"; // 屬性的輸入類型
  options?: string[]; // 用於 select 類型的選項
  transform?: (value: any) => any; // 用於轉換輸入值的函數
  renderCustomInput?: (props: CustomInputProps) => React.ReactNode; // 自定義輸入組件的渲染函數
  compositeFields?: Record<
    string,
    Omit<PropertyConfig, "label" | "compositeFields">
  >;
  properties?: Record<string, PropertyConfig>; // 用於 object 類型的嵌套屬性
  defaultValue?: any; // 屬性的默認值
  unit?: string; // 單位
}

export type PropertyConfigWithComposite = PropertyConfig & {
  compositeFields?: Record<
    string,
    Omit<PropertyConfig, "label" | "compositeFields">
  >;
};

export interface CustomInputProps {
  id: string;
  value: any;
  onChange: (value: any) => void;
}

// 元素配置接口
export interface ElementConfig {
  type: string; // 元素類型的標識符
  label: string; // 元素的顯示標籤
  properties: Record<string, PropertyConfig>; // 元素的屬性配置
  [key: string]: any; // 这将允许你使用字符串索引任何额外的属性
}

// 所有元素類型的配置對象
export type ElementTypeConfigs = Record<string, ElementConfig>;
// Record<K, V> 是 TypeScript 的一個內建泛型類型，用於創建一個對象類型，其中鍵是類型 K，值是類型 V
// 新的 Redux 状态结构

export interface WebsiteBuilderState {
  // 1. 全局佈局結構
  layout: {
    sections: Array<{
      id: string;
      type: string;
      order: number;
      // 可以根據需要添加更多屬性
    }>;
  };

  // 2. 網站全局設置
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

  // 3. 元素庫
  elementLibrary: {
    elements: Record<string, GlobalElementType>;
    configs: Record<string, ElementConfig>;
  };

  // 4. 歷史記錄和撤銷/重做功能
  history: {
    past: Array<any>;
    present: any;
    future: Array<any>;
  };

  // 5. 專案元信息
  projectMetadata: {
    name: string;
    createdAt: string;
    lastModified: string;
    collaborators: string[];
  };

  // 6. 發佈狀態
  publishStatus: {
    isPublished: boolean;
    lastPublishedAt: string | null;
    version: string;
  };

  // 7. 用戶偏好設置
  userPreferences: {
    language: string;
    editorSettings: {
      showGrid: boolean;
      snapToGrid: boolean;
      // ... 其他編輯器設置
    };
  };

  // 8. 全局拖拽狀態
  dragAndDrop: {
    currentDraggedElement: string | null;
    dragSource: string | null;
    dragTarget: string | null;
  };

  // 9. 性能相關的全局標誌
  performanceFlags: {
    previewMode: boolean;
    advancedFeaturesEnabled: boolean;
  };

  // 元素實例狀態
  instances: Record<string, BaseElementData>;

  // 當前活動元素
  activeElementId: string | null;
}
