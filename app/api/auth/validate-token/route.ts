import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firebase_db } from "@/src/config/firebaseClient";
import { Timestamp } from "firebase/firestore";

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

export async function POST(request: NextRequest) {
  try {
    const { tokenId } = await request.json();

    if (!tokenId) {
      return NextResponse.json(
        { error: "Token ID is required" },
        { status: 400 }
      );
    }

    const tokenRef = doc(firebase_db, "tokens", tokenId);
    const tokenSnap = await getDoc(tokenRef);

    if (!tokenSnap.exists()) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    const tokenData = tokenSnap.data();
    const now = Timestamp.now();

    if (tokenData.expiresAt.toDate() < now.toDate()) {
      return NextResponse.json({ error: "Token has expired" }, { status: 401 });
    }

    // 更新 lastUsedAt
    await updateDoc(tokenRef, {
      lastUsedAt: now,
    });

    return NextResponse.json({
      message: "Token validated and updated successfully",
      tokenData: {
        ...tokenData,
        lastUsedAt: now,
      },
    });
  } catch (error) {
    console.error("Error validating token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
