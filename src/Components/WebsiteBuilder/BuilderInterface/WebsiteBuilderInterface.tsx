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
  canvasOffset: { x: number; y: number };
}

// 對象類型 `T` 的所有屬性及其嵌套屬性變成可選
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface EditorSettings {
  showGrid: boolean;
  snapToGrid: boolean;
}

// Toolbar 創造 Instance
export interface CreateElementPayload {
  type: string;
  content: string;
  isLayout: boolean;
  elementType?: string;
}
