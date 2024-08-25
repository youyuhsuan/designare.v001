import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchWebsiteMetadata, saveWebsite } from "./websiteMetadataThunk";

export const websiteMetadataSlice = createSlice({
  name: "websiteMetadata",
  initialState: {
    name: "New Website",
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    saveStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
    saveError: null as string | null,
  },
  reducers: {
    updateWebsiteName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      state.lastModified = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWebsiteMetadata.fulfilled, (state, action) => {
        return {
          ...state,
          ...action.payload,
          saveStatus: "idle",
          saveError: null,
        };
      })
      .addCase(saveWebsite.pending, (state) => {
        state.saveStatus = "loading";
      })
      .addCase(saveWebsite.fulfilled, (state) => {
        state.saveStatus = "succeeded";
        state.lastModified = new Date().toISOString();
      })
      .addCase(saveWebsite.rejected, (state, action) => {
        state.saveStatus = "failed";
        state.saveError = action.error.message || "Failed to save project";
      });
  },
});

export const { updateWebsiteName } = websiteMetadataSlice.actions;

export default websiteMetadataSlice.reducer;
