import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchWebsiteMetadata,
  saveWebsiteMetadata,
} from "./websiteMetadataThunk";
import { saveElementLibrary } from "./websiteMetadataThunk";
import { WebsiteMetadata, WebsiteState } from "@/src/type/website";
import {
  ElementLibrary,
  LocalElementType,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { Timestamp } from "firebase/firestore";
import { convertTimestamp } from "@/src/utilities/convertTimestamp";

// 初始狀態
const initialState: WebsiteState = {
  metadata: null,
  elementLibrary: null,
  loadStatus: "idle",
  saveStatus: "idle",
  saveError: null,
};

export const websiteMetadataSlice = createSlice({
  name: "websiteMetadata",
  initialState: initialState,
  reducers: {
    // 更新網站名稱
    updateWebsiteName: (state, action: PayloadAction<string>) => {
      if (state.metadata) {
        state.metadata.name = action.payload;
        state.metadata.lastModified = convertTimestamp(Timestamp.now());
      }
    },
    // 樂觀更新元素
    optimisticUpdateElement: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<LocalElementType> }>
    ) => {
      if (
        state.elementLibrary &&
        state.elementLibrary.byId[action.payload.id]
      ) {
        state.elementLibrary.byId[action.payload.id] = {
          ...state.elementLibrary.byId[action.payload.id],
          ...action.payload.updates,
        };
      }
    },
    // 樂觀更新元素庫
    optimisticUpdateElementLibrary: (
      state,
      action: PayloadAction<Partial<ElementLibrary>>
    ) => {
      if (state.elementLibrary) {
        state.elementLibrary = {
          ...state.elementLibrary,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWebsiteMetadata.pending, (state) => {
        state.loadStatus = "loading";
      })
      .addCase(
        fetchWebsiteMetadata.fulfilled,
        (state, action: PayloadAction<WebsiteState>) => {
          state.metadata = action.payload.metadata;
          state.elementLibrary = action.payload.elementLibrary;
          state.loadStatus = "succeeded";
          state.saveError = null;
        }
      )
      .addCase(fetchWebsiteMetadata.rejected, (state, action) => {
        state.loadStatus = "failed";
        state.saveError = action.error.message || "無法獲取網站數據";
      })
      .addCase(saveWebsiteMetadata.pending, (state) => {
        state.saveStatus = "loading";
      })
      .addCase(
        saveWebsiteMetadata.fulfilled,
        (state, action: PayloadAction<Partial<WebsiteMetadata>>) => {
          if (state.metadata) {
            state.metadata = {
              ...state.metadata,
              ...action.payload,
              lastModified: convertTimestamp(Timestamp.now()),
            };
          }
          state.saveStatus = "succeeded";
          state.saveError = null;
        }
      )
      .addCase(saveWebsiteMetadata.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError = action.error.message || "無法儲存網站元數據";
      })
      .addCase(saveElementLibrary.pending, (state) => {
        state.saveStatus = "loading";
      })
      .addCase(
        saveElementLibrary.fulfilled,
        (state, action: PayloadAction<ElementLibrary>) => {
          if (state.elementLibrary) {
            state.elementLibrary = {
              ...state.elementLibrary,
              ...action.payload,
            };
          }
          if (state.metadata) {
            state.metadata.lastModified = convertTimestamp(Timestamp.now());
          }
          state.saveStatus = "succeeded";
          state.saveError = null;
        }
      )
      .addCase(saveElementLibrary.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError = action.error.message || "無法儲存元素庫";
      });
  },
});

export const { optimisticUpdateElement, optimisticUpdateElementLibrary } =
  websiteMetadataSlice.actions;

export const { updateWebsiteName } = websiteMetadataSlice.actions;

export default websiteMetadataSlice.reducer;
