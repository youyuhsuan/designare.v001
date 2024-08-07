import { RootState } from "@/src/libs/store";

// 選擇整個網站建設器狀態
export const selectWebsiteBuilderState = (state: RootState) =>
  state.websiteBuilder;

// 選擇所有元素
export const selectAllElements = (state: RootState) =>
  state.websiteBuilder.elements;

// 選擇特定元素
export const selectElementById = (id: string) => (state: RootState) =>
  state.websiteBuilder.elements.find((element) => element.id === id);

// 選擇網站寬度
export const selectSiteWidth = (state: RootState) =>
  state.websiteBuilder.siteWidth;

// 選擇背景顏色
export const selectBackgroundColor = (state: RootState) =>
  state.websiteBuilder.backgroundColor;
