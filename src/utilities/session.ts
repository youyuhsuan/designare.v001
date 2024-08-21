import { sessionDB } from "@/src/libs/db/sessionDB";
import { cookies } from "next/headers";
import Evervault from "@evervault/sdk";

interface SessionData {
  sessionId: string;
  userId: string;
  userEmail: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  expiresAt: {
    seconds: number;
    nanoseconds: number;
  };
}

const evervault = new Evervault(
  process.env.EVERVAULT_APP_ID as string,
  process.env.EVERVAULT_API_KEY as string
);

const getSession = async () => {
  const encryptedSessionData = cookies().get("session")?.value;
  if (!encryptedSessionData) {
    return null;
  }
  try {
    const dataToDecrypt = JSON.parse(encryptedSessionData);
    const decryptedData = await evervault.decrypt(dataToDecrypt);
    return decryptedData
      ? await sessionDB.findSession(decryptedData.sessionId)
      : null;
  } catch (error) {
    console.error("Error processing getSession():", error);
    return null;
  }
};

async function getSessionData(): Promise<SessionData | null> {
  const encryptedSessionData = cookies().get("session")?.value;
  if (!encryptedSessionData) {
    return null;
  }
  const authSessionDB = await getSession();
  if (!authSessionDB) {
    return null;
  }
  try {
    const dataToDecrypt = JSON.parse(encryptedSessionData);
    const decryptedData = await evervault.decrypt(dataToDecrypt);
    // console.log("Decrypted data:", decryptedData, typeof decryptedData);
    return decryptedData;
  } catch (error) {
    console.error("Error processing session data:", error);
    return null;
  }
}

export { getSession, getSessionData };
