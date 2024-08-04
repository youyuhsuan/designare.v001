import { NextRequest, NextResponse } from "next/server";
import { firebase_auth } from "@/src/config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { z } from "zod";
import { loginSchema } from "@/src/libs/schemas/auth";
import { createSession } from "@/src/libs/actions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    try {
      const userCredential = await signInWithEmailAndPassword(
        firebase_auth,
        email,
        password
      );
      const user = userCredential.user;

      const sessionData = await createSession(user);

      return NextResponse.json({
        user: {
          id: user.uid,
          email: user.email,
          displayName: user.displayName || null,
        },
        sessionId: sessionData.sessionId,
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error("Firebase authentication error:", error);
        switch (error.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            return NextResponse.json(
              { error: "Invalid email or password" },
              { status: 401 }
            );
          case "auth/user-disabled":
            return NextResponse.json(
              { error: "This account has been disabled" },
              { status: 403 }
            );
          case "auth/too-many-requests":
            return NextResponse.json(
              { error: "Too many login attempts. Please try again later" },
              { status: 429 }
            );
          default:
            return NextResponse.json(
              { error: "An error occurred during login" },
              { status: 500 }
            );
        }
      }
      throw error; // Re-throw if it's not a FirebaseError
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
