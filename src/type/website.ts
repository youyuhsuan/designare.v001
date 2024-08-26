import {
  ElementInstance,
  ElementLibrary,
} from "../Components/WebsiteBuilder/BuilderInterface";

export interface SerializedTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface AllWebsite {
  id: string;
  userId: string;
  url: string;
  name: string;
  lastModified: SerializedTimestamp;
  createdAt: SerializedTimestamp;
}

export interface WebsiteMetadata {
  id?: string;
  userId?: string;
  templateId?: string | null;
  name: string;
  url: string;
  description?: string;
  createdAt: SerializedTimestamp;
  lastModified: SerializedTimestamp;
  status: "draft" | "published" | "archived";
  publishedAt?: SerializedTimestamp;
  isDeleted?: boolean;
  version?: number;
  settings?: {
    theme?: string;
    layout?: string;
    customDomain?: string;
  };
}

export interface WebsiteState {
  metadata: WebsiteMetadata | null;
  elementLibrary: ElementLibrary | null;
  loadStatus: "idle" | "loading" | "succeeded" | "failed";
  saveStatus: "idle" | "loading" | "succeeded" | "failed";
  saveError: string | null;
}
