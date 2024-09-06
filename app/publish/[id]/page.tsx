"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchWebsiteMetadata } from "@/src/libs/features/websiteBuilder/websiteMetadataThunk";
import { useAppDispatch } from "@/src/libs/hook";
import { renderElement } from "@/src/utilities/elementRenderer";

export default function PublishedWebsitePage() {
  const params = useParams();
  const id = params.id as string;
  const [websiteData, setWebsiteData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    async function loadWebsite() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await dispatch(fetchWebsiteMetadata(id)).unwrap();
        setWebsiteData(data);
      } catch (err) {
        console.error("Error fetching website data:", err);
        setError("Failed to load website");
      } finally {
        setLoading(false);
      }
    }

    loadWebsite();
  }, [id, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!websiteData || !websiteData?.elementLibrary) {
    return <div>Website not found</div>;
  }

  const { updates } = websiteData?.elementLibrary;

  return (
    <>
      {Object.keys(updates.byId).map((elementId) => {
        const element = updates.byId[elementId];
        return renderElement(element);
      })}
    </>
  );
}
