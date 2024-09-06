import { firebase_db } from "@/src/config/firebaseClient";
import { UserTokenData } from "@/src/type/token";
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
        where("token.id", "==", tokenId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      const data = querySnapshot.docs[0].data();
      return this.convertToUserTokenData(data);
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
        return false;
      }
      await deleteDoc(querySnapshot.docs[0].ref);
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
        return false;
      }
      const tokenDoc = querySnapshot.docs[0];
      await updateDoc(tokenDoc.ref, { "token.lastUsedAt": Timestamp.now() });
      return true;
    } catch (e) {
      console.error(`Error updating last used time for token ${tokenId}:`, e);
      throw new Error(`Failed to update last used time for token ${tokenId}`);
    }
  },
  convertToUserTokenData(data: DocumentData): UserTokenData {
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        avatarUrl: data.user.avatarUrl,
      },
      token: {
        id: data.token.id,
        createdAt: data.token.createdAt,
        expiresAt: data.token.expiresAt,
        lastUsedAt: data.token.lastUsedAt,
      },
    };
  },
};

export { tokenDB };
