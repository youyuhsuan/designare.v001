"use client";

import React, { useState, useEffect } from "react";
import Loading from "@/src/Components/Loading/LoadingPage";

export default function LoadingWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 使用 requestIdleCallback 来确保所有内容都已渲染
    requestIdleCallback(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
