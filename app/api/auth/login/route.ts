import { NextRequest, NextResponse } from "next/server";
import { firebase_auth } from "@/src/config/firebaseClient";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { z } from "zod";
import { loginSchema } from "@/src/libs/schemas/auth";
import { createToken } from "@/src/utilities/token";

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

      // 如果 displayName 為 null 或 undefined，嘗試從 providerData 中獲取
      let displayName = user.displayName;
      if (!displayName && user.providerData.length > 0) {
        displayName = user.providerData[0].displayName || null;
      }

      // 如果仍然沒有 displayName，考慮使用郵箱的用戶名部分
      if (!displayName) {
        displayName = user.email ? user.email.split("@")[0] : null;
      }

      // 如果 displayName 存在但未同步到用戶資料，更新用戶資料
      if (displayName && !user.displayName) {
        try {
          await updateProfile(user, { displayName: displayName });
          console.log("Display name updated:", displayName);
        } catch (updateError) {
          console.error("Error updating display name:", updateError);
        }
      }
      // 創建會話
      const TokenData = await createToken(user);

      // 返回用戶信息和會話ID
      return NextResponse.json({
        user: {
          id: user.uid,
          email: user.email,
          name: user.displayName,
          avatarUrl: user.photoURL || null,
        },
        token: { id: TokenData.token.id },
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase 認證錯誤:", error);
        switch (error.code) {
          case "auth/invalid-credential":
            return NextResponse.json(
              { error: "電子郵件或密碼不正確" },
              { status: 400 }
            );
          case "auth/user-disabled":
            return NextResponse.json(
              { error: "此帳戶已被停用" },
              { status: 403 }
            );
          case "auth/user-not-found":
            return NextResponse.json(
              { error: "找不到此用戶" },
              { status: 404 }
            );
          default:
            return NextResponse.json(
              { error: "登入失敗，請稍後再試" },
              { status: 500 }
            );
        }
      }
      throw error; // 重新拋出非 FirebaseError 錯誤
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "輸入資料無效", details: error.errors },
        { status: 400 }
      );
    }
    console.error("登入錯誤:", error);
    return NextResponse.json({ error: "發生了意外錯誤" }, { status: 500 });
  }
}
