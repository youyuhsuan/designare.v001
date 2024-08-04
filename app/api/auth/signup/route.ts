import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { firebase_auth } from "@/src/config/firebase";
import { signupSchema } from "@/src/libs/schemas/auth";
import { createSession } from "@/src/libs/actions";

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

      const sessionData = await createSession(user);

      return NextResponse.json({
        user: {
          id: user.uid,
          username: username,
          email: user.email,
        },
        sessionId: sessionData.sessionId,
      });
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
      throw error; // Re-throw if it's not a FirebaseError
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
