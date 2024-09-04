import { Timestamp } from "firebase/firestore";
import { cookies } from "next/headers";
import { tokenDB } from "@/src/libs/db/tokenDB";
import Evervault from "@evervault/sdk";

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  avatarUrl?: string | null;
}

export interface Token {
  id: string;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  lastUsedAt?: Timestamp;
}

export interface UserTokenData {
  user: User;
  token: Token;
}

const evervault = new Evervault(
  process.env.EVERVAULT_APP_ID as string,
  process.env.EVERVAULT_API_KEY as string
);

export async function createToken(user: any) {
  let displayName = user.displayName;
  if (!displayName && user.providerData && user.providerData.length > 0) {
    displayName = user.providerData[0].displayName || null;
  }
  if (!displayName && user.email) {
    displayName = user.email.split("@")[0];
  }

  try {
    const TokenData: UserTokenData = {
      user: {
        id: user.uid,
        email: user.email,
        name: user.displayName,
        avatarUrl: user.photoURL || null,
      },
      token: {
        id: user.uid, // 直接使用 Firebase 用戶的 uid
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        ), // 7 days from now
        lastUsedAt: Timestamp.now(),
      },
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

export async function createThirdPartyToken(userRecord: any) {
  let displayName = userRecord.displayName;

  if (!displayName && userRecord.email) {
    displayName = userRecord.email.split("@")[0];
  }

  try {
    const TokenData: UserTokenData = {
      user: {
        id: userRecord.uid,
        email: userRecord.email,
        name: userRecord.displayName,
        avatarUrl: userRecord.photoURL || null,
      },
      token: {
        id: userRecord.uid, // 直接使用 Firebase 用戶的 uid
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        ), // 7 days from now
        lastUsedAt: Timestamp.now(),
      },
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

export async function deleteServerToken(userId: string): Promise<void> {
  try {
    await tokenDB.deleteToken(userId);
    cookies().delete("token");
  } catch (error) {
    console.error("Failed to delete token:", error);
    throw new Error("Failed to delete token");
  }
}
