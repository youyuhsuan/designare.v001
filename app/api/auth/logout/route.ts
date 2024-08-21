import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 建立回應物件，表示使用者已成功登出
    const userLogoutResponse = NextResponse.json({
      message: "The user was logged out!",
      success: true,
    });

    // 將 session cookie 設為空，並使其過期
    userLogoutResponse.cookies.set("session", "", {
      httpOnly: true, // cookie 只能通過 HTTP 請求訪問，客戶端 JavaScript 無法訪問
      expires: new Date(0), // 設置 cookie 過期時間為過去的時間，使其立即失效
      sameSite: "strict", // 設置 cookie 只能在同一站點內發送，增強安全性
      path: "/", // 指定 cookie 的有效路徑，"/" 表示整個網站
    });

    // 返回表示登出成功的回應
    return userLogoutResponse;
  } catch (error: any) {
    // 捕捉可能發生的任何錯誤，並返回 500 狀態的錯誤回應
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
