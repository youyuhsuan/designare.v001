import { Timestamp } from "firebase/firestore";
import { WebsiteMetadata } from "../type/website";
import { convertTimestamp } from "./convertTimestamp";

export function createWebsiteMetadata(
  userId: string,
  name: string,
  url: string,
  options: Partial<WebsiteMetadata> = {}
): WebsiteMetadata {
  const now = convertTimestamp(Timestamp.now());
  return {
    userId,
    name,
    url,
    templateId: options.templateId || null,
    description: options.description || "",
    createdAt: options.createdAt || now,
    lastModified: now,
    status: options.status || "draft",
    publishedAt: options.status === "published" ? now : undefined,
    version: options.version || 1,
    settings: options.settings || {},
  };
}

export function validateWebsiteMetadata(
  metadata: Partial<WebsiteMetadata>
): string | null {
  if (!metadata.userId || typeof metadata.userId !== "string")
    return "Missing or invalid userId";
  if (!metadata.name || typeof metadata.name !== "string")
    return "Missing or invalid name";
  if (!metadata.url || typeof metadata.url !== "string")
    return "Missing or invalid url";
  if (
    metadata.status &&
    !["draft", "published", "archived"].includes(metadata.status)
  ) {
    return "Invalid status";
  }
  return null;
}

export function parseWebsiteMetadata(data: any): WebsiteMetadata {
  return {
    id: data.id,
    userId: data.userId,
    templateId: data.templateId,
    name: data.name,
    url: data.url,
    description: data.description,
    createdAt: data.createdAt,
    lastModified: data.lastModified,
    status: data.status,
    publishedAt: data.publishedAt,
    version: data.version || 1,
    settings: data.settings || {},
  };
}
