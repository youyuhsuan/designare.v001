import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Evervault from "@evervault/sdk";
import { websiteDB } from "@/src/libs/db/websiteDB";
import { UserTokenData } from "@/src/type/token";

const evervault = new Evervault(
  process.env.EVERVAULT_APP_ID as string,
  process.env.EVERVAULT_API_KEY as string
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
    const dataToDecrypt = JSON.parse(encryptedTokenData);
    const decryptedData: UserTokenData = await evervault.decrypt(dataToDecrypt);
    const website = await websiteDB.getWebsite(
      decryptedData.token.id,
      params.id
    );
    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }
    const data = await request.json();
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    await websiteDB.updateWebsiteData(decryptedData.token.id, params.id, data);
    const returnUpdatedData =
      request.headers.get("return-updated-data") === "true";
    if (returnUpdatedData) {
      const updatedWebsite = await websiteDB.getWebsite(
        decryptedData.token.id,
        params.id
      );
      return NextResponse.json(updatedWebsite, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Website metadata updated successfully" },
        { status: 200 }
      );
    }
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
