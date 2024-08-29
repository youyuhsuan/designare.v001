import { NextRequest, NextResponse } from "next/server";
import { websiteDB } from "@/src/libs/db/websiteDB";
import { WebsiteMetadata } from "@/src/type/website";
import Evervault from "@evervault/sdk";
import { cookies } from "next/headers";
import { UserTokenData } from "@/src/type/token";
import { Timestamp } from "firebase/firestore";
import { convertTimestamp } from "@/src/utilities/convertTimestamp";

const evervault = new Evervault(
  process.env.EVERVAULT_APP_ID as string,
  process.env.EVERVAULT_API_KEY as string
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const encryptedTokenData = cookies().get("token")?.value;
  if (!encryptedTokenData) {
    console.log("No token found in cookies");
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    const dataToDecrypt = JSON.parse(encryptedTokenData);
    const decryptedData: UserTokenData = await evervault.decrypt(dataToDecrypt);
    const userId = decryptedData.token.id;
    const websiteId = params.id;

    console.log(`Attempting to fetch website ${websiteId} for user ${userId}`);

    const website = await websiteDB.getWebsite(userId, websiteId);

    if (!website) {
      console.log(`Website ${websiteId} not found`);
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    console.log("Website metadata:", website.metadata);
    console.log("Element library:", website.elementLibrary);

    // 檢查網站所有者
    if (!website.metadata || website.metadata.userId !== userId) {
      console.log(
        `User ${userId} is not authorized to access website ${websiteId}`
      );
      return NextResponse.json(
        { error: "Unauthorized to access this website" },
        { status: 403 }
      );
    }

    console.log(`Successfully fetched website ${websiteId} for user ${userId}`);
    return NextResponse.json(website, { status: 200 });
  } catch (error) {
    console.error("Error fetching website:", error);
    return NextResponse.json(
      { error: "Failed to fetch website" },
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
    if (
      !existingWebsite.metadata ||
      existingWebsite.metadata.id !== decryptedData.token.id
    ) {
      return NextResponse.json(
        { error: "Unauthorized to update this website" },
        { status: 403 }
      );
    }

    // 更新網站數據
    const updatedWebsiteData: Partial<WebsiteMetadata> = {
      ...body,
      lastModified: convertTimestamp(Timestamp.now()),
    };

    await websiteDB.updateWebsiteData(
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
  // 獲取加密的 token
  const encryptedTokenData = cookies().get("token")?.value;
  if (!encryptedTokenData) {
    console.log("No token found in cookies");
    return NextResponse.json({ error: "No token found" }, { status: 400 });
  }

  try {
    // 解密 token
    const dataToDecrypt = JSON.parse(encryptedTokenData);
    const decryptedData: UserTokenData = await evervault.decrypt(dataToDecrypt);

    console.log("Decrypted token data:", decryptedData);

    // 獲取現有網站數據
    const existingWebsite = await websiteDB.getWebsite(
      decryptedData.token.id,
      params.id
    );

    if (!existingWebsite) {
      console.log(`Website with ID ${params.id} not found`);
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    console.log("Existing website data:", existingWebsite);

    // 檢查用戶是否有權限刪除該網站
    if (
      !existingWebsite.metadata ||
      existingWebsite.metadata.userId !== decryptedData.user.id
    ) {
      console.log("Unauthorized attempt to delete website");
      return NextResponse.json(
        { error: "Unauthorized to delete this website" },
        { status: 403 }
      );
    }
    // 刪除網站
    await websiteDB.deleteWebsite(decryptedData.token.id, params.id);

    console.log(`Website with ID ${params.id} deleted successfully`);

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
