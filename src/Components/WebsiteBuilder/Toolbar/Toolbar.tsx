"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "@/src/libs/hook";
import { createElementInstance } from "@/src/libs/features/websiteBuilder/elementLibrarySlice";
import { selectPresent } from "@/src/libs/features/websiteBuilder/historySelector";
import { addToHistory } from "@/src/libs/features/websiteBuilder/historySlice";
import { toolbarItems, ToolbarItem, ToolbarSubItem } from "./ToolbarConfig";

interface HandleAddElementParams {
  type: string;
  content: any;
  isLayout?: boolean;
  elementType: string;
}

const ToolbarContainer = styled.div`
  display: flex;
  background-color: white;
  border-right: 1px solid #e0e0e0;
  height: 100vh;
`;

const MainToolbar = styled.div`
  width: 60px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #e0e0e0;
`;

const ExpandedPanel = styled.div`
  width: 240px;
  padding: 16px;
  background-color: #f5f5f5;
  overflow-y: auto;
`;

const ToolbarItemButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  margin-bottom: 10px;
  background-color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ItemLabel = styled.span`
  font-size: 10px;
  margin-top: 4px;
  text-align: center;
`;

const SubItemButton = styled.button<{ elementType: string }>`
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 4px;
  text-align: left;
  background-color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  ${({ elementType }) => {
    switch (elementType) {
      case "H1":
        return `font-size: 2.5rem;`;
      case "H2":
        return `font-size: 2rem;`;
      case "H3":
        return `font-size: 1.75rem;`;
      case "H4":
        return `font-size: 1.5rem;`;
      case "H5":
        return `font-size: 1.25rem;`;
      case "P1":
        return `font-size: 1rem; font-weight: normal;`;
      case "P2":
        return `font-size: 0.875rem; font-weight: normal;`;
      case "P3":
        return `font-size: 0.75rem; font-weight: normal;`;
      default:
        return `font-size: 14px;`;
    }
  }}

  &:hover {
    background-color: #e0e0e0;
  }
`;
const Toolbar: React.FC = () => {
  // 狀態：當前擴展的項目索引，默認為 null（即沒有項目擴展）
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  // Redux 的 dispatch 函數，用於派發動作
  const dispatch = useAppDispatch();

  // 從 Redux store 中選擇當前狀態
  const presentState = useAppSelector(selectPresent);

  // 處理添加元素的函數
  const handleAddElement = ({
    type,
    content,
    isLayout = false,
    elementType,
  }: HandleAddElementParams) => {
    // 派發創建元素實例的動作
    dispatch(
      createElementInstance({
        type,
        content,
        isLayout,
        elementType,
      })
    );
    // 更新歷史記錄
    const updatedState = { ...presentState };
    dispatch(addToHistory(updatedState));
  };

  // 處理工具欄項目的點擊事件
  const handleItemClick = (item: ToolbarItem, index: number) => {
    if (item.items) {
      // 如果該項目有子項目，切換擴展狀態
      setExpandedItem(expandedItem === index ? null : index);
    } else {
      // 如果該項目沒有子項目，將擴展面板收起
      setExpandedItem(null);
    }
  };

  // 渲染子項目的函數
  const renderSubItems = (items: ToolbarSubItem[], parentType: string) => {
    return items.map((item, index) => (
      <SubItemButton
        key={index}
        elementType={item.elementType || parentType} // 傳遞 `elementType` 屬性
        onClick={() =>
          handleAddElement({
            type: parentType,
            content: item.content || item.label,
            elementType: item.elementType,
          })
        }
      >
        {item.label}
      </SubItemButton>
    ));
  };

  return (
    <ToolbarContainer>
      <MainToolbar>
        {/* 渲染工具欄主項目 */}
        {toolbarItems.map((item, index) => (
          <ToolbarItemButton
            key={index}
            onClick={() => handleItemClick(item, index)}
          >
            <item.icon size={24} /> {/* 渲染項目的圖標 */}
            <ItemLabel>{item.label}</ItemLabel> {/* 渲染項目的標籤 */}
          </ToolbarItemButton>
        ))}
      </MainToolbar>
      {/* 渲染擴展面板及子項目 */}
      {expandedItem !== null && toolbarItems[expandedItem].items && (
        <ExpandedPanel>
          <h3>{toolbarItems[expandedItem].label}</h3>
          {renderSubItems(
            toolbarItems[expandedItem].items!,
            toolbarItems[expandedItem].type
          )}
        </ExpandedPanel>
      )}
    </ToolbarContainer>
  );
};

export default Toolbar;
