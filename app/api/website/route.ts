import Evervault from "@evervault/sdk";
import { NextRequest, NextResponse } from "next/server";
import { websiteDB } from "@/src/libs/db/websiteDB";
import { cookies } from "next/headers";
import { UserTokenData } from "@/src/type/token";
import { WebsiteData } from "@/src/type/website";
import { Timestamp } from "firebase/firestore";

const evervault = new Evervault(
  process.env.EVERVAULT_APP_ID as string,
  process.env.EVERVAULT_API_KEY as string
);

export async function POST(request: NextRequest) {
  const encryptedTokenData = cookies().get("token")?.value;
  if (!encryptedTokenData) {
    return NextResponse.json({ error: "No token found" }, { status: 400 });
  }
  try {
    const dataToDecrypt = JSON.parse(encryptedTokenData);
    const decryptedData: UserTokenData = await evervault.decrypt(dataToDecrypt);
    const body = await request.json();

    // 驗證請求體
    if (!body.name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const websiteData: WebsiteData = {
      userId: decryptedData.token.id,
      templateId: body.templateId || null,
      name: body.name,
      url:
        body.url ||
        `https://${body.name
          .toLowerCase()
          .replace(/\s+/g, "-")}-${Date.now()}.com`,
      createdAt: Timestamp.now(),
      lastModified: Timestamp.now(),
    };

    const newWebsiteId = await websiteDB.createWebsite(websiteData);

    return NextResponse.json(
      { id: newWebsiteId, ...websiteData },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating website:", error);
    return NextResponse.json(
      { error: "Failed to create website" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const encryptedTokenData = cookies().get("token")?.value;
  if (!encryptedTokenData) {
    return NextResponse.json({ error: "No token found" }, { status: 400 });
  }
  try {
    const dataToDecrypt = JSON.parse(encryptedTokenData);
    const decryptedData: UserTokenData = await evervault.decrypt(dataToDecrypt);
    const websites = await websiteDB.getAllWebsites(decryptedData.token.id);
    return NextResponse.json(websites);
  } catch (error) {
    console.error("Error getting user websites:", error);
    return NextResponse.json(
      { error: "Failed to get user websites" },
      { status: 500 }
    );
  }
}
