import { Website } from "@/src/type/website";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchWebsiteMetadata = createAsyncThunk(
  "websiteMetadata/fetchWebsiteMetadata",
  async (websiteId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/website/${websiteId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch website metadata");
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("fetchWebsiteMetadata unknown error occurred");
    }
  }
);

export const saveWebsite = createAsyncThunk(
  "websiteMetadata/saveWebsite",
  async (website: Website, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/website/${website.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(website),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error!");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("saveWebsite unknown error occurred");
    }
  }
);
