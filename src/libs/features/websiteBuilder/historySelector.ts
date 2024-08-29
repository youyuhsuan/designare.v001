import { RootState } from "@/src/libs/store";
import { createSelector } from "@reduxjs/toolkit";

export const selecthistoryState = (state: RootState) => state.history;

export const selectPresent = createSelector(
  selecthistoryState,
  (historySlice) => historySlice.present
);
