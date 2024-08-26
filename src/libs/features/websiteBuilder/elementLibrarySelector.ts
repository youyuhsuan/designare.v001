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

export const selectElementLibrary = createSelector(
  selectElementLibraryState,
  (elementsSlice) => ({
    byId: elementsSlice.byId,
    allIds: elementsSlice.allIds,
    selectedId: elementsSlice.selectedId,
    configs: elementsSlice.configs,
  })
);

export const selectElementsArray = createSelector(
  selectElementInstances,
  selectElementAllInstances,
  (byId, allIds) => allIds.map((id) => byId[id])
);

export const selectSelectedElementId = createSelector(
  selectElementLibraryState,
  (elementsSlice) => elementsSlice.selectedId
);
