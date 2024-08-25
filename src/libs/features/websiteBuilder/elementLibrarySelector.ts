import { createSelector } from "reselect";
import { RootState } from "@/src/libs/store";

export const selectElementLibraryState = (state: RootState) =>
  state.elementLibrary;

// instances 屬性
export const selectElementInstances = createSelector(
  selectElementLibraryState,
  (elementsSlice) => elementsSlice.byId
);
