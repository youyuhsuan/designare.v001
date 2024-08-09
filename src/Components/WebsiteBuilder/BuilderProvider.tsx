//  Redux 來管理全局元素庫和網站整體設置
// 定義全局狀態結構，包括元素庫、網站寬度

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface InnerElement {
  id: string;
  content: ReactNode;
}

interface BuilderContextType {
  innerElements: { [key: string]: InnerElement[] };
  updateInnerElements: (
    sectionId: string,
    newInnerElements: InnerElement[]
  ) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export const BuilderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [innerElements, setInnerElements] = useState<{
    [key: string]: InnerElement[];
  }>({});

  const updateInnerElements = (
    sectionId: string,
    newInnerElements: InnerElement[]
  ) => {
    setInnerElements((prev) => ({
      ...prev,
      [sectionId]: newInnerElements,
    }));
  };

  return (
    <BuilderContext.Provider value={{ innerElements, updateInnerElements }}>
      {children}
    </BuilderContext.Provider>
  );
};

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};
