"use client";

import React, { useEffect, useState, useCallback } from "react";
import Dashboard, { ActionCard } from "@/src/Components/Dashboard/Dashboard";
import { Website } from "../type/website";
import { Timestamp } from "firebase/firestore";

const DashboardContent: React.FC = () => {
  const actionCards: ActionCard[] = [
    {
      title: "建立新網站",
      description: "空白畫布",
      href: "/create",
      onClick: () => {},
    },
    {
      title: "使用模板",
      description: "查看所有模板",
      href: "/templates",
      onClick: () => {},
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/website/getAll");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWebsites(data);
    } catch (err) {
      console.error("Error fetching websites:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  // fetchData 變化，需要重新執行

  const filteredWebsites = websites.filter((website) =>
    website.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleViewToggle = (view: "grid" | "list") => {
    setViewMode(view);
  };

  const formatTimestamp = (timestamp: Timestamp): string => {
    return timestamp.toDate().toLocaleString();
  };

  const RecentItems: React.FC = () => (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {filteredWebsites.map((website) => (
        <div key={website.id}>
          {website.name} - 最後編輯: {formatTimestamp(website.lastModified)}
        </div>
      ))}
    </>
  );

  return (
    <Dashboard
      actionCards={actionCards}
      onSearch={handleSearch}
      onViewToggle={handleViewToggle}
      recentFiles={<RecentItems />}
      searchTerm={searchTerm}
      viewMode={viewMode}
    />
  );
};

export default DashboardContent;
