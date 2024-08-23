import { firebase_db } from "@/src/config/firebaseClient";
import { UserTokenData } from "@/src/utilities/token";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

const TOKENS_COLLECTION = "tokens";

const tokenDB = {
  async insertToken(TokenData: UserTokenData): Promise<string> {
    try {
      const cleanUserData = Object.fromEntries(
        Object.entries(TokenData.user).filter(([_, v]) => v !== undefined)
      );

      const cleanTokenData = {
        user: cleanUserData,
        token: TokenData.token,
      };

      const docRef = await addDoc(
        collection(firebase_db, TOKENS_COLLECTION),
        cleanTokenData
      );

      console.log(`Token inserted successfully with ID: ${docRef.id}`);
      return docRef.id;
    } catch (e) {
      console.error("Error inserting token:", e);
      throw new Error("Failed to insert token");
    }
  },

  async findToken(tokenId: string): Promise<UserTokenData | null> {
    try {
      const q = query(
        collection(firebase_db, TOKENS_COLLECTION),
        where("tokenId", "==", tokenId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No matching token found");
        return null;
      }
      return querySnapshot.docs[0].data() as UserTokenData;
    } catch (e) {
      console.error("Error finding token:", e);
      throw new Error("Failed to find token");
    }
  },

  async deleteToken(tokenId: string): Promise<boolean> {
    try {
      const q = query(
        collection(firebase_db, TOKENS_COLLECTION),
        where("tokenId", "==", tokenId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No token found to delete");
        return false;
      }
      await deleteDoc(querySnapshot.docs[0].ref);
      console.log(`Token with ID ${tokenId} deleted successfully`);
      return true;
    } catch (e) {
      console.error("Error deleting token:", e);
      throw new Error("Failed to delete token");
    }
  },

  async updateTokenLastUsed(tokenId: string): Promise<boolean> {
    try {
      const q = query(
        collection(firebase_db, TOKENS_COLLECTION),
        where("token.id", "==", tokenId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log(`No token found with ID ${tokenId}`);
        return false;
      }
      const tokenDoc = querySnapshot.docs[0];
      await updateDoc(tokenDoc.ref, { "token.lastUsedAt": Timestamp.now() });
      console.log(`Token with ID ${tokenId} updated successfully`);
      return true;
    } catch (e) {
      console.error(`Error updating last used time for token ${tokenId}:`, e);
      throw new Error(`Failed to update last used time for token ${tokenId}`);
    }
  },
};

export { tokenDB };
