import Evervault from "@evervault/sdk";
import { NextRequest, NextResponse } from "next/server";
import { websiteDB } from "@/src/libs/db/websiteDB";
import { cookies } from "next/headers";
import { UserTokenData } from "@/src/type/token";
import {
  createWebsiteMetadata,
  validateWebsiteMetadata,
} from "@/src/utilities/websiteMetadata";

const evervault = new Evervault(
  process.env.EVERVAULT_APP_ID as string,
  process.env.EVERVAULT_API_KEY as string
);

export async function POST(request: NextRequest) {
  const encryptedTokenData = cookies().get("token")?.value;

  if (!encryptedTokenData) {
    console.error("No token found");
    return NextResponse.json({ error: "No token found" }, { status: 400 });
  }

  try {
    const dataToDecrypt = JSON.parse(encryptedTokenData);
    const decryptedData: UserTokenData = await evervault.decrypt(dataToDecrypt);
    console.log("Decrypted token data:", decryptedData);

    const body = await request.json();

    // 驗證請求體
    if (!body.name) {
      console.error("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let url = body.url;
    if (!url) {
      const baseUrl = "http://localhost:3000/";
      const slug = body.name.toLowerCase().replace(/\s+/g, "-");
      url = `${baseUrl}${slug}-${Date.now()}`;
    }

    const websiteData = createWebsiteMetadata(
      decryptedData.token.id,
      body.name,
      url,
      {
        templateId: body.templateId,
        description: body.description,
        status: body.publish ? "published" : "draft",
        settings: body.settings,
      }
    );
    console.log("Website data created:", websiteData);

    const validationError = validateWebsiteMetadata(websiteData);
    if (validationError) {
      console.error("Validation error:", validationError);
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const newWebsiteId = await websiteDB.createWebsite(websiteData);
    console.log("New website created with ID:", newWebsiteId);

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
    console.log(
      `Retrieved ${websites.length} websites for user ${decryptedData.token.id}`
    );
    return NextResponse.json(websites);
  } catch (error) {
    console.error("Error getting user websites:", error);
    return NextResponse.json(
      { error: "Failed to get user websites" },
      { status: 500 }
    );
  }
}
