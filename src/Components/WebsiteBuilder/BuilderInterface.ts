// 位置接口
export interface Position {
  x: number;
  y: number;
}

// 基礎元素數據接口
export interface BaseElementData {
  id: string;
  type: string;
  content: string;
  height: number;
  isLayout: boolean;
}

// 布局元素數據接口
export interface LayoutElementData extends BaseElementData {
  isLayout: true;
}

// 自由拖動元素數據接口
export interface FreeDraggableElementData extends BaseElementData {
  isLayout: false;
  position: Position;
}

// 元素數據類型
export type ElementData = LayoutElementData | FreeDraggableElementData;

// 全局元素類型
export interface GlobalElementType {
  id: string;
  type: string;
  isLayout: boolean;
  defaultProps: {
    content: string;
    height: number;
    position?: Position;
  };
}

// 元素庫項目接口
export interface ElementLibraryItem extends GlobalElementType {}

// 網站建設器狀態接口
export interface WebsiteBuilderState {
  elements: ElementData[];
  siteWidth: string;
  activeElementId: string | null;
}

// 全局狀態接口
export interface GlobalState {
  websiteBuilder: WebsiteBuilderState;
  elementLibrary: GlobalElementType[];
  siteWidth: string;
  // 其他全局狀態...
}
