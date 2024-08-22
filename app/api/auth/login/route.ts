import { NextRequest, NextResponse } from "next/server";
import { firebase_auth } from "@/src/config/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { z } from "zod";
import { loginSchema } from "@/src/libs/schemas/auth";
import { createToken } from "@/src/libs/actions";

export async function POST(request: NextRequest) {
  try {
    // 解析請求體並驗證數據
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    try {
      // 嘗試使用 Firebase 進行用戶登入
      const userCredential = await signInWithEmailAndPassword(
        firebase_auth,
        email,
        password
      );
      const user = userCredential.user;

      // 創建會話
      const TokenData = await createToken(user);
      console.log("login token setting success", TokenData);

      // 返回用戶信息和會話ID
      return NextResponse.json({
        user: {
          id: user.uid,
          email: user.email,
          username: user.displayName || null,
        },
        tokenId: TokenData.tokenId,
      });
    } catch (error) {
      // 處理 Firebase 錯誤
      if (error instanceof FirebaseError) {
        console.error("Firebase 認證錯誤:", error);
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            return NextResponse.json(
              { error: "無效的電子郵件或密碼" },
              { status: 401 }
            );
          case "auth/user-disabled":
            return NextResponse.json(
              { error: "此帳戶已被禁用" },
              { status: 403 }
            );
          case "auth/too-many-requests":
            return NextResponse.json(
              { error: "嘗試登入次數過多，請稍後再試" },
              { status: 429 }
            );
          default:
            return NextResponse.json(
              { error: "登入過程中發生錯誤" },
              { status: 500 }
            );
        }
      }
      // 如果錯誤不是 FirebaseError，重新拋出異常
      throw error;
    }
  } catch (error) {
    // 處理 Zod 驗證錯誤
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "輸入數據無效", details: error.errors },
        { status: 400 }
      );
    }
    // 處理其他錯誤
    console.error("登入錯誤:", error);
    return NextResponse.json({ error: "發生了意外錯誤" }, { status: 500 });
  }
}
