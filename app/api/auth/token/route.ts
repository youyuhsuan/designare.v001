import { NextRequest, NextResponse } from "next/server";
import { tokenDB } from "@/src/libs/db/tokenDB";
import { cookies } from "next/headers";
import { UserTokenData } from "@/src/type/token";
import Evervault from "@evervault/sdk";

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
    const decryptedData: UserTokenData = await evervault.decrypt(dataToDecrypt);
    const foundToken = await tokenDB.findToken(decryptedData.token.id);
    await tokenDB.updateTokenLastUsed(decryptedData.token.id);
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
