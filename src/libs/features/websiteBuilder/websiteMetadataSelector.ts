import { createSelector } from "reselect";
import { RootState } from "@/src/libs/store";

export const selectWebsiteMetadataState = (state: RootState) =>
  state.websiteMetadata;

export const selectWebsiteMetadata = createSelector(
  selectWebsiteMetadataState,
  (websiteState) => websiteState.metadata
);
export const selectAllWebsiteMetadata = createSelector(
  selectWebsiteMetadataState,
  (websiteMetadata) => websiteMetadata
);

// 選擇保存狀態
export const selectSaveStatus = createSelector(
  selectWebsiteMetadataState,
  (websiteState) => websiteState.saveStatus
);

// 選擇保存錯誤
export const selectSaveError = createSelector(
  selectWebsiteMetadataState,
  (websiteState) => websiteState.saveError
);
