import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchWebsiteMetadata,
  saveWebsiteMetadata,
} from "./websiteMetadataThunk";
import { saveElementLibrary } from "./websiteMetadataThunk";
import { WebsiteMetadata, WebsiteState } from "@/src/type/website";
import { ElementLibrary } from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { Timestamp } from "firebase/firestore";
import { convertTimestamp } from "@/src/utilities/convertTimestamp";

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
    updateWebsiteName: (state, action: PayloadAction<string>) => {
      if (state.metadata) {
        state.metadata.name = action.payload;
        state.metadata.lastModified = convertTimestamp(Timestamp.now());
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
        state.saveError =
          action.error.message || "Failed to fetch website data";
      })
      // Save website metadata
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
        state.saveError =
          action.error.message || "Failed to save website metadata";
      })

      // saveElementLibrary cases
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
        state.saveError =
          action.error.message || "Failed to save element library";
      });
  },
});

export const { updateWebsiteName } = websiteMetadataSlice.actions;
export default websiteMetadataSlice.reducer;
