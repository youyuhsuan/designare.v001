import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/src/libs/store";

export const selectGlobalSettings = (state: RootState) => state.globalSettings;

export const selectCurrentDevice = createSelector(
  [selectGlobalSettings],
  (globalSettings) => globalSettings.currentDevice
);

export const selectCurrentLayoutSettings = createSelector(
  [selectGlobalSettings],
  (globalSettings) => globalSettings[globalSettings.currentDevice]
);

export const selectCanvasOffset = createSelector(
  [selectGlobalSettings],
  (globalSettings) => globalSettings.canvasOffset
);
