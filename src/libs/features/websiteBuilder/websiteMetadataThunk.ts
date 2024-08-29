import {
  ElementInstance,
  ElementLibrary,
  LocalElementType,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { WebsiteMetadata, WebsiteState } from "@/src/type/website";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch } from "@/src/libs/hook";
import {
  optimisticUpdateElement,
  optimisticUpdateElementLibrary,
} from "./websiteMetadataSlice";
import { RootState } from "../../store";

interface SaveWebsiteMetadataPayload {
  id: string;
  data: Partial<WebsiteMetadata>;
}

interface SaveElementLibraryPayload {
  id: string;
  data: Partial<ElementLibrary>;
}

export const fetchWebsiteMetadata = createAsyncThunk(
  "websiteMetadata/fetchWebsiteMetadata",
  async (websiteId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/website/${websiteId}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch website metadata");
      }
      console.log("fetchWebsiteMetadata");
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("fetchWebsiteMetadata unknown error occurred");
    }
  }
);

export const saveWebsiteMetadata = createAsyncThunk(
  "websiteMetadata/save",
  async (
    { id, data }: { id: string; data: Partial<WebsiteMetadata> },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/website/${id}/metadata`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save website metadata");
      }

      const updatedData = await response.json();
      return updatedData;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

export const saveElementLibrary = createAsyncThunk(
  "elementLibrary/save",
  async ({ id, data }: SaveElementLibraryPayload, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/website/${id}/elementLibrary`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error!");
      }

      const updatedData = await response.json();
      return updatedData;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue(
        "Unknown error occurred while saving element library"
      );
    }
  }
);

export const createNewWebsite = createAsyncThunk(
  "website/create",
  async (websiteData: Partial<WebsiteMetadata>, { rejectWithValue }) => {
    try {
      const newWebsite = {
        name: websiteData.name || "New Website",
        description: websiteData.description || "",
        templateId: websiteData.templateId,
        publish: websiteData.status === "published",
        settings: websiteData.settings || {},
      };

      const response = await fetch("/api/website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWebsite),
        credentials: "include", // 這確保包含cookies在請求中
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create new website");
      }

      const createdWebsite: WebsiteMetadata = await response.json();
      return createdWebsite;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(
          "Unknown error occurred while saving createdWebsite"
        );
      }
    }
  }
);

export const updateElementLibrary = createAsyncThunk(
  "elementLibrary/update",
  async (
    {
      websiteId,
      updates,
      deletedIds,
    }: {
      websiteId: string;
      updates:
        | Record<string, Partial<LocalElementType>>
        | Partial<ElementLibrary>;
      deletedIds?: string[];
    },
    { dispatch, getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const originalElements = state.websiteMetadata.elementLibrary?.byId || {};

    // 應用樂觀更新
    if ("byId" in updates) {
      // 整個元素庫更新
      dispatch(
        optimisticUpdateElementLibrary(updates as Partial<ElementLibrary>)
      );
    } else {
      // 單個或多個元素更新
      Object.entries(updates).forEach(([id, elementUpdates]) => {
        dispatch(optimisticUpdateElement({ id, updates: elementUpdates }));
      });
    }

    try {
      const response = await fetch(`/api/website/${websiteId}/elementLibrary`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates, deletedIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to update element library");
      }

      const data = await response.json();

      // 成功後獲取最新數據
      dispatch(fetchElementLibrary(websiteId));

      return data;
    } catch (error) {
      // 如果更新失敗，回滾到原始狀態
      if ("byId" in updates) {
        dispatch(optimisticUpdateElementLibrary({ byId: originalElements }));
      } else {
        Object.keys(updates).forEach((id) => {
          dispatch(
            optimisticUpdateElement({ id, updates: originalElements[id] })
          );
        });
      }

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue(
          "Unknown error occurred while updating element library"
        );
      }
    }
  }
);

export const fetchElementLibrary = createAsyncThunk(
  "elementLibrary/fetch",
  async (websiteId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/website/${websiteId}/elementLibrary`);

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.message || "Failed to fetch element library"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // 处理网络错误或其他错误
      return rejectWithValue("An unknown error occurred");
    }
  }
);
