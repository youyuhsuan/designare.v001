"use client";

import React, { useEffect, useState, useCallback } from "react";

// type
import { AllWebsite } from "@/src/type/website";

// Components
import Dashboard, { ActionCard } from "@/src/Components/Dashboard/Dashboard";
import RecentItems from "@/src/Components/Dashboard/RecentItems";

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
  const [websites, setWebsites] = useState<AllWebsite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 定義取得資料的函數
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/website");
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

  // 使用 effect 來在組件掛載時取得資料
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 根據搜尋關鍵字過濾網站資料
  const filteredWebsites = websites.filter((website) =>
    website.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 處理搜尋輸入變更
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 切換顯示模式
  const handleViewToggle = (view: "grid" | "list") => {
    setViewMode(view);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/website/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setWebsites((prevWebsites) =>
        prevWebsites.filter((website) => website.id !== id)
      );
    } catch (err) {
      console.error("Error deleting website:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const handleUpdateWebsite = async (updatedWebsite: AllWebsite) => {
    try {
      const response = await fetch(
        `/api/website/${updatedWebsite.id}/metadata`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: updatedWebsite.name }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchData();
    } catch (err) {
      console.error("Error updating website:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return (
    <Dashboard
      actionCards={actionCards}
      onSearch={handleSearch}
      onViewToggle={handleViewToggle}
      recentFiles={
        <RecentItems
          websites={filteredWebsites}
          isLoading={isLoading}
          error={error}
          onDelete={handleDelete}
          onUpdateWebsite={handleUpdateWebsite}
        />
      }
      searchTerm={searchTerm}
      viewMode={viewMode}
    />
  );
};

export default DashboardContent;
