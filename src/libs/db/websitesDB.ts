import { firebase_db } from "@/src/config/firebaseClient";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

const USER_WEBSITES_COLLECTION = "user_websites";

interface CreateWebsiteData {
  user_id: string;
  template_id: string;
  title: string;
  description?: string;
  content?: any;
}

const userWebsiteDB = {
  async createUserWebsite(websiteData: CreateWebsiteData): Promise<string> {
    try {
      const cleanWebsiteData = Object.fromEntries(
        Object.entries(websiteData).filter(([_, v]) => v !== undefined)
      );

      const docRef = await addDoc(
        collection(firebase_db, USER_WEBSITES_COLLECTION),
        {
          ...cleanWebsiteData,
          created_at: new Date(),
          updated_at: new Date(),
        }
      );

      console.log(`User website created successfully with ID: ${docRef.id}`);
      return docRef.id;
    } catch (e) {
      console.error("Error creating user website:", e);
      throw new Error("Failed to create user website");
    }
  },

  // 你可以在這裡添加其他與用戶網站相關的數據庫操作函數
};
