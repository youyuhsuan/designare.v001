import React, { useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../libs/hook";
import { selectElementLibrary } from "../libs/features/websiteBuilder/elementLibrarySelector";
import { updateElementLibrary } from "../libs/features/websiteBuilder/websiteMetadataThunk";
import {
  ElementLibrary,
  ElementInstance,
} from "./WebsiteBuilder/BuilderInterface";
import { debounce, isEqual } from "lodash";

const AutoSave: React.FC<{ id: string }> = ({ id: websiteId }) => {
  const dispatch = useAppDispatch(); // 獲取 dispatch 函數
  const elementLibrary = useAppSelector(selectElementLibrary); // 獲取元素庫的狀態
  const prevElementLibraryRef = useRef<ElementLibrary | null>(null); // 儲存前一個元素庫狀態的參考

  console.log("elementLibrary", elementLibrary);
  // 使用 debounce 函數創建一個防抖動的保存函數
  const debouncedSaveElementLibrary = useMemo(
    () =>
      debounce((updates: Partial<ElementLibrary>, deletedIds: string[]) => {
        dispatch(updateElementLibrary({ websiteId, updates, deletedIds })); // 發送更新元素庫的 action
      }, 2000), // 設置防抖動時間為 2000 毫秒
    [dispatch, websiteId] // 當 dispatch 或 websiteId 改變時重新創建 debouncedSaveElementLibrary
  );

  useEffect(() => {
    // 比較當前的元素庫與之前的元素庫是否不同
    if (
      elementLibrary &&
      !isEqual(elementLibrary, prevElementLibraryRef.current)
    ) {
      const updates: Partial<ElementLibrary> = {}; // 儲存更新的元素庫部分
      const changedInstances: Record<string, ElementInstance> = {}; // 儲存變更的元素實例
      const deletedIds: string[] = []; // 儲存被刪除的元素 ID

      // 檢查新增和更新的實例
      Object.entries(elementLibrary.byId).forEach(([id, instance]) => {
        const prevInstance = prevElementLibraryRef.current?.byId[id];
        if (!prevInstance || !isEqual(prevInstance, instance)) {
          changedInstances[id] = instance;
        }
      });

      // 檢查刪除的實例
      if (prevElementLibraryRef.current) {
        Object.keys(prevElementLibraryRef.current.byId).forEach((id) => {
          if (!elementLibrary.byId[id]) {
            deletedIds.push(id);
          }
        });
      }

      // 如果有變更的實例，將其添加到 updates
      if (Object.keys(changedInstances).length > 0) {
        updates.byId = changedInstances;
      }

      // 檢查 allIds 是否有變化
      if (
        !isEqual(elementLibrary.allIds, prevElementLibraryRef.current?.allIds)
      ) {
        updates.allIds = elementLibrary.allIds;
      }

      // 檢查 selectedId 是否有變化
      if (
        elementLibrary.selectedId !== prevElementLibraryRef.current?.selectedId
      ) {
        updates.selectedId = elementLibrary.selectedId;
      }

      // 檢查 configs 是否有變化
      if (
        !isEqual(elementLibrary.configs, prevElementLibraryRef.current?.configs)
      ) {
        updates.configs = elementLibrary.configs;
      }

      // 如果有更新或刪除的元素，則調用 debouncedSaveElementLibrary 進行保存
      if (Object.keys(updates).length > 0 || deletedIds.length > 0) {
        debouncedSaveElementLibrary(updates, deletedIds);
      }

      // 更新前一個元素庫狀態
      prevElementLibraryRef.current = JSON.parse(
        JSON.stringify(elementLibrary)
      );
    }

    // 清理函數，用於取消防抖動函數的調用
    return () => {
      debouncedSaveElementLibrary.cancel();
    };
  }, [elementLibrary, debouncedSaveElementLibrary]); // 當 elementLibrary 或 debouncedSaveElementLibrary 改變時重新執行 useEffect

  return null;
};

export default AutoSave;
