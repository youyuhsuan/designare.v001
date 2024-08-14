import { createSelector } from "reselect";
import { RootState } from "@/src/libs/store";

// 根状态选择器
export const selectWebsiteBuilderState = (state: RootState) =>
  state.websiteBuilder;

// 全局设置选择器
export const selectGlobalSettings = createSelector(
  selectWebsiteBuilderState,
  (state) => state.globalSettings
);

export const selectSiteWidth = createSelector(
  selectGlobalSettings,
  (settings) => settings.siteWidth
);

export const selectCanvasHeight = createSelector(
  selectGlobalSettings,
  (settings) => settings.canvasHeight
);

// 元素库选择器
export const selectElementLibrary = createSelector(
  selectWebsiteBuilderState,
  (state) => state.elementLibrary
);

export const selectElementConfigs = createSelector(
  selectElementLibrary,
  (library) => library.configs
);

// 元素实例选择器
export const selectAllElementInstances = createSelector(
  selectWebsiteBuilderState,
  (state) => state.instances
);

export const selectElementInstanceById = (id: string) =>
  createSelector(selectAllElementInstances, (instances) => instances[id]);
// 一个以 ID 为键的对象，其中包含了所有元素的实际数据

// 活动元素选择器
export const selectActiveElementId = createSelector(
  selectWebsiteBuilderState,
  (state) => state.activeElementId
);

export const selectActiveElement = createSelector(
  selectAllElementInstances,
  selectActiveElementId,
  (instances, activeId) => (activeId ? instances[activeId] : null)
);

// 历史记录选择器
export const selectHistory = createSelector(
  selectWebsiteBuilderState,
  (state) => state.history
);

// 项目元数据选择器
export const selectProjectMetadata = createSelector(
  selectWebsiteBuilderState,
  (state) => state.projectMetadata
);

// 发布状态选择器
export const selectPublishStatus = createSelector(
  selectWebsiteBuilderState,
  (state) => state.publishStatus
);

// 用户偏好设置选择器
export const selectUserPreferences = createSelector(
  selectWebsiteBuilderState,
  (state) => state.userPreferences
);

// 拖放状态选择器
export const selectDragAndDropState = createSelector(
  selectWebsiteBuilderState,
  (state) => state.dragAndDrop
);

// 性能标志选择器
export const selectPerformanceFlags = createSelector(
  selectWebsiteBuilderState,
  (state) => state.performanceFlags
);

// 使用示例
// const siteWidth = useSelector(selectSiteWidth);
// const activeElement = useSelector(selectActiveElement);
// const elementConfig = useSelector(selectElementConfigs);
