import { RootState } from "@/src/libs/store";

export const selectWebsiteBuilderState = (state: RootState) =>
  state.websiteBuilder;

export const selectAllElements = (state: RootState) =>
  state.websiteBuilder.elements;

export const selectElementById = (id: string) => (state: RootState) =>
  state.websiteBuilder.elements.find((element: any) => element.id === id);

export const selectActiveElementId = (state: RootState) =>
  state.websiteBuilder.activeElementId;

export const selectSiteWidth = (state: RootState) =>
  state.websiteBuilder.siteWidth;

export const selectCanvasHeight = (state: RootState) =>
  state.websiteBuilder.canvasHeight;

// export const selectBackgroundColor = (state: RootState) =>
//   state.websiteBuilder.backgroundColor;
