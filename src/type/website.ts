import { Timestamp } from "firebase/firestore";

export interface Website {
  id: string;
  userId: string;
  url: string;
  name: string;
  lastModified: Timestamp;
  createdAt: Timestamp;
}

export interface WebsiteData {
  userId: string;
  templateId?: string;
  name: string;
  url: string;
  description?: string;
  content?: any;
  createdAt: Timestamp;
  lastModified: Timestamp;
}
