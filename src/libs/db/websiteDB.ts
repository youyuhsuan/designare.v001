import { firebase_db } from "@/src/config/firebaseClient";
import { Website, WebsiteData } from "@/src/type/website";
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

const USER_WEBSITES_COLLECTION = "user_websites";

const websiteDB = {
  async createWebsite(websiteData: WebsiteData): Promise<string> {
    try {
      const cleanWebsiteData = Object.fromEntries(
        Object.entries(websiteData).filter(([_, v]) => v !== undefined)
      );
      const docRef = await addDoc(
        collection(firebase_db, USER_WEBSITES_COLLECTION),
        {
          ...cleanWebsiteData,
          lastModified: Timestamp.now(),
          createdAt: Timestamp.now(),
        }
      );
      console.log(`User website created successfully with ID: ${docRef.id}`);
      return docRef.id;
    } catch (e) {
      console.error("Error creating user website:", e);
      throw new Error("Failed to create user website");
    }
  },
  async getAllWebsites(userId: string): Promise<Website[]> {
    try {
      const websitesRef = collection(firebase_db, USER_WEBSITES_COLLECTION);
      const q = query(websitesRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      const websites: Website[] = [];
      querySnapshot.forEach((doc) => {
        websites.push({
          id: doc.id,
          ...(doc.data() as Omit<Website, "id">),
        });
      });

      console.log(`Retrieved ${websites.length} websites for user ${userId}`);
      return websites;
    } catch (e) {
      console.error("Error getting user websites:", e);
      throw new Error("Failed to get user websites");
    }
  },
  async getWebsite(userId: string, id: string): Promise<Website | null> {
    try {
      const websitesRef = collection(firebase_db, USER_WEBSITES_COLLECTION);
      const q = query(
        websitesRef,
        where("userId", "==", userId),
        where("id", "==", id)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log(`No website found with id ${id} for user ${userId}`);
        return null;
      }
      const doc = querySnapshot.docs[0];
      const website: Website = {
        id: doc.id,
        ...(doc.data() as Omit<Website, "id">),
      };

      console.log(`Retrieved website ${id} for user ${userId}`);
      return website;
    } catch (e) {
      console.error("Error getting user websites:", e);
      throw new Error("Failed to get user websites");
    }
  },
  async updateWebsite(
    userId: string,
    websiteId: string,
    websiteData: Partial<Omit<Website, "id" | "userId">>
  ): Promise<void> {
    try {
      const websiteRef = doc(firebase_db, USER_WEBSITES_COLLECTION, websiteId);
      const websiteSnapshot = await getDoc(websiteRef);

      if (!websiteSnapshot.exists()) {
        throw new Error("Website not found");
      }

      const websiteData = websiteSnapshot.data() as Website;
      if (websiteData.userId !== userId) {
        throw new Error("Unauthorized to update this website");
      }

      await updateDoc(websiteRef, {
        ...websiteData,
        lastModified: new Date(),
      });

      console.log(`Updated website ${websiteId} for user ${userId}`);
    } catch (e) {
      console.error("Error updating website:", e);
      throw new Error("Failed to update website");
    }
  },

  async deleteWebsite(userId: string, websiteId: string): Promise<void> {
    try {
      const websiteRef = doc(firebase_db, USER_WEBSITES_COLLECTION, websiteId);
      const websiteSnapshot = await getDoc(websiteRef);

      if (!websiteSnapshot.exists()) {
        throw new Error("Website not found");
      }

      const websiteData = websiteSnapshot.data() as Website;
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
