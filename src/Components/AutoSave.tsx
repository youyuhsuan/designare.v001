import React, { useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { Timestamp } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "../libs/hook";
import {
  saveWebsiteMetadata,
  saveElementLibrary,
} from "../libs/features/websiteBuilder/websiteMetadataThunk";
import { WebsiteMetadata } from "../type/website";
import { ElementLibrary } from "./WebsiteBuilder/BuilderInterface";
import { selectWebsiteMetadata } from "../libs/features/websiteBuilder/websiteMetadataSelector";
import { selectElementLibraryData } from "../libs/features/websiteBuilder/elementLibrarySelector";
import { convertTimestamp } from "../utilities/convertTimestamp";

const AutoSave: React.FC<{ id: string }> = ({ id }) => {
  const dispatch = useAppDispatch();
  const websiteMetadata = useAppSelector(selectWebsiteMetadata);
  const elementLibrary = useAppSelector(selectElementLibraryData);

  const debouncedSaveMetadata = useMemo(
    () =>
      debounce((data: Partial<WebsiteMetadata>) => {
        dispatch(saveWebsiteMetadata({ id, data }));
      }, 2000),
    [dispatch, id]
  );

  const debouncedSaveElementLibrary = useMemo(
    () =>
      debounce((data: Partial<ElementLibrary>) => {
        dispatch(saveElementLibrary({ id, data }));
      }, 2000),
    [dispatch, id]
  );

  useEffect(() => {
    if (websiteMetadata) {
      const metadataToSave: Partial<WebsiteMetadata> = {
        lastModified: convertTimestamp(Timestamp.now()),
        // 只包含已更改的字段
        ...(websiteMetadata.name && { name: websiteMetadata.name }),
        ...(websiteMetadata.url && { url: websiteMetadata.url }),
        ...(websiteMetadata.status && { status: websiteMetadata.status }),
        // 添加其他可能更改的字段
      };
      debouncedSaveMetadata(metadataToSave);
    }
    return () => {
      debouncedSaveMetadata.cancel();
    };
  }, [websiteMetadata, debouncedSaveMetadata]);

  useEffect(() => {
    if (elementLibrary) {
      // 只保存已更改的部分
      const elementLibraryToSave: Partial<ElementLibrary> = {};
      if (elementLibrary.byId) elementLibraryToSave.byId = elementLibrary.byId;
      if (elementLibrary.allIds)
        elementLibraryToSave.allIds = elementLibrary.allIds;
      if (elementLibrary.selectedId !== undefined)
        elementLibraryToSave.selectedId = elementLibrary.selectedId;

      debouncedSaveElementLibrary(elementLibraryToSave);
    }
    return () => {
      debouncedSaveElementLibrary.cancel();
    };
  }, [elementLibrary, debouncedSaveElementLibrary]);

  return null;
};

export default AutoSave;
