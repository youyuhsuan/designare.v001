"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch } from "@/src/libs/hook";
import { CanvasArea } from "@/src/Components/WebsiteBuilder/CanvasArea";
import { fetchWebsiteMetadata } from "@/src/libs/features/websiteBuilder/websiteMetadataThunk";

export default function WebsiteBuilderPage() {
  const params = useParams(); // 路由參數
  const id = params.id as string;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchWebsiteMetadata(id));
    }
  }, [id, dispatch]);

  if (!id) {
    return <div>Loading...</div>;
  }

  return <CanvasArea websiteId={id} />;
}
