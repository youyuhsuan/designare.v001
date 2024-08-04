import { Timestamp } from "firebase/firestore";
import Evervault from "@evervault/sdk";
import { cookies } from "next/headers";
import { sessionDB } from "@/src/libs/db";

const evervault = new Evervault(
  process.env.EVERVAULT_APP_ID as string,
  process.env.EVERVAULT_API_KEY as string
);

export async function createSession(user: any) {
  try {
    const sessionData = {
      sessionId: user.uid, // 直接使用 Firebase 用戶的 uid
      userId: user.uid,
      userEmail: user.email,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ), // 7 days from now
    };

    // 加密會話數據
    const encryptedSessionData = await evervault.encrypt(sessionData);

    // 將加密的會話數據設置為 cookie
    const cookieValue =
      typeof encryptedSessionData === "string"
        ? encryptedSessionData
        : JSON.stringify(encryptedSessionData);

    cookies().set("session", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    await sessionDB.insertSession(sessionData);

    return sessionData;
  } catch (error) {
    console.error("Failed to create session:", error);
    throw new Error("Failed to create session");
  }
}
