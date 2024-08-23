import { NextRequest, NextResponse } from "next/server";
import admin from "@/src/config/firebaseAdmin"; // 導入初始化後的 admin
import { createThirdPartyToken, createToken } from "@/src/utilities/token";

export async function POST(request: NextRequest) {
  try {
    if (!admin) {
      throw new Error("Firebase Admin SDK not initialized");
    }

    // 從請求中提取 ID 令牌
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "未提供 ID 令牌" }, { status: 400 });
    }

    // 驗證 ID 令牌
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // 獲取用戶信息
    const userRecord = await admin.auth().getUser(uid);

    // 創建會話
    const TokenData = await createThirdPartyToken(userRecord);

    return NextResponse.json(TokenData);
  } catch (error) {
    console.error("認證錯誤:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "認證失敗" }, { status: 500 });
  }
}
