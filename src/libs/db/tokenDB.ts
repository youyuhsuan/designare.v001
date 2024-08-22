import { firebase_db } from "@/src/config/firebaseClient";
import {
  collection,
  addDoc,
  query,
  where,
  Timestamp,
  getDocs,
  runTransaction,
  DocumentReference,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

interface TokenData {
  tokenId: string;
  userId: string;
  userEmail: string;
  username: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

const tokenDB = {
  async insertToken(TokenData: TokenData): Promise<void> {
    console.info(TokenData);
    try {
      const insertTokenData = await addDoc(
        collection(firebase_db, "tokens"),
        TokenData
      );
      console.log(`tokenDB insertToken success: ${insertTokenData.id}`);
    } catch (e) {
      console.error(`insertToken error adding document:`, e);
    }
  },
  async findToken(tokenId: string) {
    try {
      const q = query(
        collection(firebase_db, "tokens"),
        where("tokenId", "==", tokenId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No matching token found");
        return null;
      }
      return querySnapshot.docs[0].data();
    } catch (e) {
      console.error(`findToken error creating query:`, e);
      return null;
    }
  },
};

export { tokenDB };
export type { TokenData };
