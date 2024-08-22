import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { createToken } from "@/src/libs/actions";

export async function POST(request: NextRequest) {
  try {
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
    const TokenData = await createToken(idToken);

    return NextResponse.json({
      user: {
        id: userRecord.uid,
        email: userRecord.email || null,
        name: userRecord.displayName || null,
      },
      tokenId: TokenData.tokenId,
    });
  } catch (error) {
    console.error("認證錯誤:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "認證失敗" }, { status: 500 });
  }
}
