import { createSelector } from "reselect";
import { RootState } from "@/src/libs/store";

// 選擇網站元數據的整體狀態
export const selectWebsiteMetadataState = (state: RootState) =>
  state.websiteMetadata;

// 選擇網站元數據中的 `metadata`, 只在 `websiteState.metadata` 發生變化時重新計算
export const selectWebsiteMetadata = createSelector(
  selectWebsiteMetadataState,
  (websiteState) => websiteState.metadata
);

// 選擇整個網站元數據狀態, 返回 `websiteMetadata` 物件本身
export const selectAllWebsiteMetadata = createSelector(
  selectWebsiteMetadataState,
  (websiteMetadata) => websiteMetadata
);

// 選擇保存操作的選擇 `saveStatus`
export const selectSaveStatus = createSelector(
  selectWebsiteMetadataState,
  (websiteState) => websiteState.saveStatus
);

// 選擇保存操作選擇 `saveError`
export const selectSaveError = createSelector(
  selectWebsiteMetadataState,
  (websiteState) => websiteState.saveError
);
