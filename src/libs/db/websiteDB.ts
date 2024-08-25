import { ElementLibrary } from "@/src/Components/WebsiteBuilder/BuilderInterface";
import { firebase_db } from "@/src/config/firebaseClient";
import { AllWebsite, WebsiteMetadata, WebsiteState } from "@/src/type/website";
import { convertTimestamp } from "@/src/utilities/convertTimestamp";
import { parseWebsiteMetadata } from "@/src/utilities/websiteMetadata";
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
  doc,
  getDoc,
} from "firebase/firestore";

const WEBSITES_COLLECTION = "websites";

const websiteDB = {
  async createWebsite(
    websiteMetadata: Omit<WebsiteMetadata, "createdAt" | "lastModified">
  ): Promise<string> {
    try {
      const cleanWebsiteMetadata = Object.fromEntries(
        Object.entries(websiteMetadata).filter(([_, v]) => v !== undefined)
      );
      const docRef = await addDoc(
        collection(firebase_db, WEBSITES_COLLECTION),
        {
          ...cleanWebsiteMetadata,
        }
      );
      console.log(`User website created successfully with ID: ${docRef.id}`);
      return docRef.id;
    } catch (e) {
      console.error("Error creating user website:", e);
      throw new Error("Failed to create user website");
    }
  },
  async getAllWebsites(userId: string): Promise<AllWebsite[]> {
    try {
      const websitesRef = collection(firebase_db, WEBSITES_COLLECTION);
      const q = query(websitesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const websites: AllWebsite[] = [];
      querySnapshot.forEach((doc) => {
        const websiteData = doc.data() as Omit<AllWebsite, "id">;
        websites.push({
          id: doc.id,
          ...websiteData,
        });
      });
      return websites;
    } catch (e) {
      console.error("Error getting user websites:", e);
      throw new Error("Failed to get user websites");
    }
  },
  async getWebsite(userId: string, id: string): Promise<WebsiteState | null> {
    try {
      const websiteRef = doc(firebase_db, WEBSITES_COLLECTION, id);
      const websiteDoc = await getDoc(websiteRef);

      if (!websiteDoc.exists()) {
        console.log(`No website found with id ${id}`);
        return null;
      }

      const websiteData = websiteDoc.data();
      if (websiteData.userId !== userId) {
        console.log(`Website ${id} does not belong to user ${userId}`);
        return null;
      }

      const metadata = parseWebsiteMetadata({
        id: websiteDoc.id,
        ...websiteData,
      });

      const elementLibrary: ElementLibrary = websiteData.elementLibrary || {
        byId: {},
        allIds: [],
        selectedId: null,
      };

      // 構建符合 Website 接口的返回對象
      return {
        metadata: metadata,
        elementLibrary: elementLibrary,
        loadStatus: "idle",
        saveStatus: "idle",
        saveError: null,
      };
    } catch (e) {
      console.error("Error getting website:", e);
      throw new Error("Failed to get website");
    }
  },
  async updateWebsiteData(
    userId: string,
    websiteId: string,
    websiteData: Partial<Omit<WebsiteMetadata, "userId" | "createdAt">>
  ): Promise<void> {
    try {
      const websiteRef = doc(firebase_db, WEBSITES_COLLECTION, websiteId);
      const websiteSnapshot = await getDoc(websiteRef);

      if (!websiteSnapshot.exists()) {
        throw new Error("Website not found");
      }
      const existingWebsiteData = websiteSnapshot.data() as WebsiteMetadata;
      if (existingWebsiteData.userId !== userId) {
        throw new Error("Unauthorized to update this website");
      }
      await updateDoc(websiteRef, {
        ...websiteData,
        lastModified: convertTimestamp(Timestamp.now()),
      });

      console.log(`Updated website data for ${websiteId}`);
    } catch (e) {
      console.error("Error updating website data:", e);
      throw new Error("Failed to update website data");
    }
  },
  async updateElementLibrary(
    userId: string,
    websiteId: string,
    elementLibrary: Partial<ElementLibrary>
  ): Promise<void> {
    try {
      const websiteRef = doc(firebase_db, WEBSITES_COLLECTION, websiteId);
      const websiteSnapshot = await getDoc(websiteRef);

      if (!websiteSnapshot.exists()) {
        throw new Error("Website not found");
      }
      const existingWebsiteData = websiteSnapshot.data() as WebsiteMetadata;
      if (existingWebsiteData.userId !== userId) {
        throw new Error("Unauthorized to update this website");
      }
      await updateDoc(websiteRef, {
        elementLibrary: elementLibrary,
        lastModified: convertTimestamp(Timestamp.now()),
      });

      console.log(`Updated element library for website ${websiteId}`);
    } catch (e) {
      console.error("Error updating element library:", e);
      throw new Error("Failed to update element library");
    }
  },

  async deleteWebsite(userId: string, websiteId: string): Promise<void> {
    try {
      const websiteRef = doc(firebase_db, WEBSITES_COLLECTION, websiteId);
      const websiteSnapshot = await getDoc(websiteRef);

      if (!websiteSnapshot.exists()) {
        throw new Error("Website not found");
      }

      const websiteData = websiteSnapshot.data() as WebsiteMetadata;
      if (websiteData.userId !== userId) {
        throw new Error("Unauthorized to delete this website");
      }

      await deleteDoc(websiteRef);

      console.log(`Deleted website ${websiteId} for user ${userId}`);
    } catch (e) {
      console.error("Error deleting website:", e);
      throw new Error("Failed to delete website");
    }
  },
};

export { websiteDB };
