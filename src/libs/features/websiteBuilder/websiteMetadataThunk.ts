import { ElementLibrary } from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { WebsiteMetadata, WebsiteState } from "@/src/type/website";
import { createAsyncThunk } from "@reduxjs/toolkit";

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
