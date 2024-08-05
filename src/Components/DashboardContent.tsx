"use client";

import React, { useEffect, useState, useCallback } from "react";
import DashboardTemplate, {
  ActionCard,
} from "@/src/Components/DashboardTemplate";

interface Project {
  id: number;
  name: string;
  lastEdited: string;
}

const DashboardContent: React.FC = () => {
  const actionCards: ActionCard[] = [
    {
      title: "建立新網站",
      description: "空白畫布",
      href: "/create-new-site",
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProjects([
        { id: 1, name: "aaa", lastEdited: "2小前" },
        { id: 2, name: "bbb", lastEdited: "昨天" },
        { id: 3, name: "ccc", lastEdited: "3天前" },
      ]);
    } catch (err) {
      setError("fetchData");
    } finally {
      setIsLoading(false);
    }
  }, []);
  // 記得回調的參數,[] 只執行第一次

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  // fetchData 變化，需要重新執行

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleViewToggle = (view: "grid" | "list") => {
    setViewMode(view);
  };

  const RecentItems: React.FC = () => (
    <>
      {filteredProjects.map((project) => (
        <div key={project.id}>
          {project.name} - 最後編輯: {project.lastEdited}
        </div>
      ))}
    </>
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error {error}</div>;

  return (
    <DashboardTemplate
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
