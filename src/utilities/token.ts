import { Timestamp } from "firebase/firestore";
import Evervault from "@evervault/sdk";
import { cookies } from "next/headers";
import { tokenDB } from "@/src/libs/db/tokenDB";
import { UserRecord } from "firebase-admin/auth";

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

// 生成 Token
export async function createToken(user: any) {
  let displayName = user.displayName;
  if (!displayName && user.providerData && user.providerData.length > 0) {
    displayName = user.providerData[0].displayName || null;
    console.log("Display name from provider data:", displayName);
  }
  if (!displayName && user.email) {
    displayName = user.email.split("@")[0];
    console.log("Display name derived from email:", displayName);
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
    console.log("Display name derived from email:", displayName);
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

    console.log("TokenData", TokenData);

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

// const validateAndUpdateToken = async (tokenId) => {
//   const tokenRef = doc(db, "tokens", tokenId);
//   const tokenSnap = await getDoc(tokenRef);

//   if (!tokenSnap.exists()) {
//     throw new Error("Token not found");
//   }

//   const tokenData = tokenSnap.data();
//   const now = Timestamp.now();

//   if (tokenData.expiresAt.toDate() < now.toDate()) {
//     throw new Error("Token has expired");
//   }

//   // 更新 lastUsedAt
//   await updateDoc(tokenRef, {
//     lastUsedAt: now,
//   });

//   return tokenData;
// };

export const fetchTokenData = async (): Promise<UserTokenData> => {
  try {
    const response = await fetch("/api/auth/token");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: UserTokenData = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch token data:", error);
    throw error;
  }
};

// 本地儲存中緩存的 token 資料
// export async function getServerSideCachedToken(): Promise<UserTokenData | null> {
//   const cookieStore = cookies();
//   const encryptedToken = cookieStore.get("token");

//   if (encryptedToken) {
//     try {
//       const decryptedToken = await evervault.decrypt(encryptedToken.value);
//       const tokenData: UserTokenData = JSON.parse(decryptedToken);

//       // 檢查 token 是否過期
//       if (new Date(tokenData.token.expiresAt.seconds * 1000) > new Date()) {
//         return tokenData;
//       }
//     } catch (error) {
//       console.error("Error decrypting token:", error);
//     }
//   }

//   return null;
// }

export async function getClientSideCachedToken(): Promise<UserTokenData | null> {
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  };

  const encryptedToken = getCookie("token");

  if (encryptedToken) {
    try {
      const decryptedToken = await evervault.decrypt(encryptedToken);
      const tokenData: UserTokenData = JSON.parse(decryptedToken);

      // 檢查 token 是否過期
      if (new Date(tokenData.token.expiresAt.seconds * 1000) > new Date()) {
        return tokenData;
      }
    } catch (error) {
      console.error("Error decrypting token:", error);
    }
  }

  return null;
}

export async function deleteToken(userId: string): Promise<void> {
  try {
    // 從數據庫中刪除 token
    await tokenDB.deleteToken(userId);

    // 刪除 cookie
    if (typeof window !== "undefined") {
      // 客戶端刪除 cookie
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } else {
      // 服務器端刪除 cookie
      cookies().delete("token");
    }

    console.log("Token deleted successfully");
  } catch (error) {
    console.error("Failed to delete token:", error);
    throw new Error("Failed to delete token");
  }
}
