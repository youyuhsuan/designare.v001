import { Timestamp } from "firebase/firestore";
import Evervault from "@evervault/sdk";
import { cookies } from "next/headers";
import { tokenDB } from "@/src/libs/db/tokenDB";

const evervault = new Evervault(
  process.env.EVERVAULT_APP_ID as string,
  process.env.EVERVAULT_API_KEY as string
);

export async function createToken(user: any) {
  try {
    const TokenData = {
      tokenId: user.uid, // 直接使用 Firebase 用戶的 uid
      userId: user.uid,
      username: user.username,
      userEmail: user.email,
      createdAt: Timestamp.now(),
      expiresAt: Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ), // 7 days from now
    };

    // 加密會話數據
    const encryptedTokenData = await evervault.encrypt(TokenData);

    // 將加密的會話數據設置為 cookie
    const cookieValue =
      typeof encryptedTokenData === "string"
        ? encryptedTokenData
        : JSON.stringify(encryptedTokenData);

    cookies().set("token", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    await tokenDB.insertToken(TokenData);

    return TokenData;
  } catch (error) {
    console.error("Failed to create token:", error);
    throw new Error("Failed to create token");
  }
}
