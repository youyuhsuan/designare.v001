import { createSelector } from "reselect";
import { RootState } from "@/src/libs/store";

export const selectElementLibraryState = (state: RootState) =>
  state.elementLibrary;

export const selectElementInstances = createSelector(
  selectElementLibraryState,
  (elementsSlice) => elementsSlice.byId
);

export const selectElementAllInstances = createSelector(
  selectElementLibraryState,
  (elementsSlice) => elementsSlice.allIds
);

export const selectElementLibraryData = createSelector(
  selectElementLibraryState,
  (elementsSlice) => ({
    byId: elementsSlice.byId,
    allIds: elementsSlice.allIds,
    selectedId: elementsSlice.selectedId,
    configs: elementsSlice.configs,
  })
);
