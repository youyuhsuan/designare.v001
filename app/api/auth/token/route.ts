import { NextRequest, NextResponse } from "next/server";
import Evervault from "@evervault/sdk";
import { tokenDB } from "@/src/libs/db/tokenDB";
import { cookies } from "next/headers";

interface TokenData {
  tokenId: string;
  userId: string;
  username: string;
  userEmail: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  expiresAt: {
    seconds: number;
    nanoseconds: number;
  };
}

const evervault = new Evervault(
  process.env.EVERVAULT_APP_ID as string,
  process.env.EVERVAULT_API_KEY as string
);

export async function GET(request: NextRequest) {
  const encryptedTokenData = cookies().get("token")?.value;

  if (!encryptedTokenData) {
    return NextResponse.json({ error: "No token found" }, { status: 400 });
  }

  try {
    const dataToDecrypt = JSON.parse(encryptedTokenData);
    const decryptedData: TokenData = await evervault.decrypt(dataToDecrypt);
    const foundToken = await tokenDB.findToken(decryptedData.tokenId);
    if (!foundToken) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }
    return NextResponse.json(decryptedData);
  } catch (error) {
    console.error("Error processing token:", error);
    return NextResponse.json(
      { error: "Failed to process token" },
      { status: 500 }
    );
  }
}
