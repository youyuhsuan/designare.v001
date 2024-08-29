import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { z } from "zod";
import { firebase_auth } from "@/src/config/firebaseClient";
import { forgotPasswordSchema } from "@/src/libs/schemas/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    try {
      await sendPasswordResetEmail(firebase_auth, email);
      return NextResponse.json({ message: "Password reset email sent" });
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase authentication error:", error);
        switch (error.code) {
          case "auth/email-already-in-use":
            return NextResponse.json(
              { error: "Email already in use" },
              { status: 400 }
            );
          case "auth/invalid-email":
            return NextResponse.json(
              { error: "Invalid email format" },
              { status: 400 }
            );
          case "auth/weak-password":
            return NextResponse.json(
              { error: "Password is too weak" },
              { status: 400 }
            );
          default:
            return NextResponse.json(
              { error: "Failed to create account" },
              { status: 500 }
            );
        }
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
