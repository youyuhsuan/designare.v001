"use client";

import React, { useState, useEffect } from "react"; // 引入 React 和相關的 hooks
import Loading from "@/src/Components/Loading/LoadingPage"; // 引入顯示加載狀態的組件

// 通用的加載包裝組件
export default function ClientLoadingWrapper({
  children,
}: {
  children: React.ReactNode; // 接收的 props，包括子組件
}) {
  const [isLoading, setIsLoading] = useState(true); // 設置初始加載狀態為 true

  useEffect(() => {
    // 在組件首次渲染後，將加載狀態設置為 false
    setIsLoading(false);
  }, []); // 空依賴數組表示此 effect 只在首次渲染時執行

  // 根據 isLoading 狀態選擇顯示內容
  if (isLoading) {
    return <Loading />; // 如果仍在加載中，顯示 Loading 組件
  }

  // 加載完成後，顯示子組件
  return <>{children}</>;
}
