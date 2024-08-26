import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Evervault from "@evervault/sdk";
import { websiteDB } from "@/src/libs/db/websiteDB";
import { UserTokenData } from "@/src/type/token";
import { unstable_cache } from "next/cache";

const evervault = new Evervault(
  process.env.EVERVAULT_APP_ID as string,
  process.env.EVERVAULT_API_KEY as string
);

// 緩存 token 解密結果，有效期設置為 1 小時
const decryptToken = unstable_cache(
  async (encryptedToken: string) => {
    const dataToDecrypt = JSON.parse(encryptedToken);
    return (await evervault.decrypt(dataToDecrypt)) as UserTokenData;
  },
  ["decryptToken"],
  { revalidate: 3600 } // 1 小時後重新驗證
);

// 緩存網站數據獲取，有效期設置為 5 分鐘
const getCachedWebsite = (userId: string, websiteId: string) =>
  unstable_cache(
    async () => {
      return await websiteDB.getWebsite(userId, websiteId);
    },
    ["getWebsite", userId, websiteId],
    { revalidate: 300 } // 5 分鐘後重新驗證
  );

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const encryptedTokenData = cookies().get("token")?.value;
  if (!encryptedTokenData) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    // 使用緩存的 token 解密
    const decryptedData = await decryptToken(encryptedTokenData);

    // 使用緩存的網站數據獲取，但只用於驗證網站存在性和所有權
    const website = await getCachedWebsite(decryptedData.token.id, params.id)();

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    // Parse request body
    const data = await request.json();

    // Validate request body
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // 直接更新元素庫，不再重新獲取整個網站數據
    await websiteDB.updateElementLibrary(
      decryptedData.token.id,
      params.id,
      data
    );

    const updatedLibrary = await websiteDB.getElementLibrary(
      decryptedData.token.id,
      params.id
    );
    return NextResponse.json(updatedLibrary, { status: 200 });
  } catch (error) {
    console.error("Error updating website metadata:", error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized to update this website") {
        return NextResponse.json(
          { error: "Unauthorized to update this website" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update website metadata" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const encryptedTokenData = cookies().get("token")?.value;
  if (!encryptedTokenData) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    // 使用緩存的 token 解密
    const decryptedData = await decryptToken(encryptedTokenData);

    // 使用緩存的網站數據獲取，但只用於驗證網站存在性和所有權
    const website = await getCachedWebsite(decryptedData.token.id, params.id)();

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    // 獲取元素庫數據
    const elementLibrary = await websiteDB.getElementLibrary(
      decryptedData.token.id,
      params.id
    );

    if (!elementLibrary) {
      return NextResponse.json(
        { error: "Element library not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(elementLibrary, { status: 200 });
  } catch (error) {
    console.error("Error fetching element library:", error);

    if (error instanceof Error) {
      if (error.message === "Unauthorized to access this website") {
        return NextResponse.json(
          { error: "Unauthorized to access this website" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to fetch element library" },
      { status: 500 }
    );
  }
}
