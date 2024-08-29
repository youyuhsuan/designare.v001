"use client";

import React, { useState, useEffect } from "react"; // 引入 React 和兩個 hooks：useState 和 useEffect
import Loading from "@/src/Components/Loading/LoadingPage"; // 引入顯示加載狀態的組件

// 異步操作來手動控制加載狀態
export default function ManualLoading() {
  // 設置狀態變量 isLoading，初始值為 true
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 模擬異步操作
    const loadData = async () => {
      // 使用 Promise 來模擬加載延遲（2秒）
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // 當模擬的異步操作完成後，將 isLoading 設置為 false
      setIsLoading(false);
    };

    // 調用 loadData 函數來執行模擬異步操作
    loadData();
  }, []); // 空依賴數組表示 useEffect 僅在首次渲染時執行

  // 根據 isLoading 狀態選擇顯示內容
  if (isLoading) {
    // 如果 isLoading 為 true，顯示 Loading 組件
    return <Loading />;
  }

  // 當 isLoading 為 false 時，顯示實際的內容
  return <div>Your page content here</div>;
}
