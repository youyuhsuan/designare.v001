import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { firebase_auth } from "@/src/config/firebaseClient";
import { signupSchema } from "@/src/libs/schemas/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = signupSchema.parse(body);

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        firebase_auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update user profile with username
      await updateProfile(user, { displayName: username });
      return NextResponse.json({
        user: {
          id: user.uid,
          username: username,
          email: user.email,
        },
        message: "註冊成功",
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase 認證錯誤:", error);
        switch (error.code) {
          case "auth/email-already-in-use":
            return NextResponse.json(
              { error: "電子郵件已被使用" },
              { status: 400 }
            );
          case "auth/invalid-email":
            return NextResponse.json(
              { error: "電子郵件格式不正確" },
              { status: 400 }
            );
          case "auth/weak-password":
            return NextResponse.json(
              { error: "密碼過於簡單" },
              { status: 400 }
            );
          default:
            return NextResponse.json(
              { error: "創建帳號失敗" },
              { status: 500 }
            );
        }
      }
      throw error; // Re-throw if it's not a FirebaseError
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "輸入資料無效", details: error.errors },
        { status: 400 }
      );
    }
    console.error("註冊錯誤:", error);
    return NextResponse.json({ error: "發生了意外錯誤" }, { status: 500 });
  }
}
