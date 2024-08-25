import { NextRequest, NextResponse } from "next/server";
import { websiteDB } from "@/src/libs/db/websiteDB";
import { WebsiteData } from "@/src/type/website";
import Evervault from "@evervault/sdk";
import { cookies } from "next/headers";
import { UserTokenData } from "@/src/type/token";
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
    if (!body.name || !body.userId) {
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const encryptedTokenData = cookies().get("token")?.value;
  if (!encryptedTokenData) {
    return NextResponse.json({ error: "No token found" }, { status: 400 });
  }
  try {
    const dataToDecrypt = JSON.parse(encryptedTokenData);
    const decryptedData: UserTokenData = await evervault.decrypt(dataToDecrypt);
    const body = await request.json();

    // 驗證請求體
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // 獲取現有網站數據
    const existingWebsite = await websiteDB.getWebsite(
      decryptedData.token.id,
      params.id
    );
    if (!existingWebsite) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    // 檢查用戶是否有權限更新該網站
    if (existingWebsite.userId !== decryptedData.token.id) {
      return NextResponse.json(
        { error: "Unauthorized to update this website" },
        { status: 403 }
      );
    }

    // 更新網站數據
    const updatedWebsiteData: Partial<WebsiteData> = {
      ...body,
      lastModified: Timestamp.now(),
    };

    await websiteDB.updateWebsite(
      decryptedData.token.id,
      params.id,
      updatedWebsiteData
    );

    return NextResponse.json(
      { message: "Website updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating website:", error);
    return NextResponse.json(
      { error: "Failed to update website" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const encryptedTokenData = cookies().get("token")?.value;
  if (!encryptedTokenData) {
    return NextResponse.json({ error: "No token found" }, { status: 400 });
  }
  try {
    const dataToDecrypt = JSON.parse(encryptedTokenData);
    const decryptedData: UserTokenData = await evervault.decrypt(dataToDecrypt);

    // 獲取現有網站數據
    const existingWebsite = await websiteDB.getWebsite(
      decryptedData.token.id,
      params.id
    );
    if (!existingWebsite) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    // 檢查用戶是否有權限刪除該網站
    if (existingWebsite.userId !== decryptedData.token.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this website" },
        { status: 403 }
      );
    }

    // 刪除網站
    await websiteDB.deleteWebsite(decryptedData.token.id, params.id);

    return NextResponse.json(
      { message: "Website deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting website:", error);
    return NextResponse.json(
      { error: "Failed to delete website" },
      { status: 500 }
    );
  }
}
