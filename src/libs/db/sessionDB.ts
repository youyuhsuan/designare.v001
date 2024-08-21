import { firebase_db } from "@/src/config/firebase";
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

interface SessionData {
  sessionId: string;
  userId: string;
  userEmail: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

const sessionDB = {
  async insertSession(sessionData: SessionData): Promise<void> {
    console.info(sessionData);
    try {
      const insertSessionData = await addDoc(
        collection(firebase_db, "sessions"),
        sessionData
      );
      console.log(`sessionDB insertSession success: ${insertSessionData.id}`);
    } catch (e) {
      console.error(`insertSession error adding document:`, e);
    }
  },
  async findSession(sessionId: string) {
    try {
      const q = query(
        collection(firebase_db, "sessions"),
        where("sessionId", "==", sessionId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log("No matching session found");
        return null;
      }
      return querySnapshot.docs[0].data();
    } catch (e) {
      console.error(`findSession error creating query:`, e);
      return null;
    }
  },
};

export { sessionDB };
export type { SessionData };
