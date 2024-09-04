"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "@/src/libs/hook";
import { createElementInstance } from "@/src/libs/features/websiteBuilder/elementLibrarySlice";
import { selectPresent } from "@/src/libs/features/websiteBuilder/historySelector";
import { addToHistory } from "@/src/libs/features/websiteBuilder/historySlice";
import { toolbarItems, ToolbarItem, ToolbarSubItem } from "./ToolbarConfig";
import { Button } from "../../Button";
import RenderSubItems from "./ToolbarRenderer";

interface HandleAddElementParams {
  type: string;
  content: any;
  isLayout?: boolean;
  elementType: string;
}

const ToolbarContainer = styled.div`
  display: flex;
  color:${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.background};
  border-right: 1px solid ${(props) => props.theme.colors.border}
  height: 100dvh;
`;

const MainToolbar = styled.div`
  width: 60px;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid ${(props) => props.theme.colors.border};
`;

const ExpandedPanel = styled.div`
  width: 16rem; // 248px
  padding: 1rem;
  background-color: ${(pros) => pros.theme.colors.background};
  overflow-y: auto;
`;

const Toolbar: React.FC = () => {
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
    const isLayoutType = [
      "layout",
      "standardLayout",
      "sidebarLayout",
      "grid",
    ].includes(elementType || "");

    const isImageType = [
      "circle",
      "square",
      "fourTwo",
      "fourThree",
      "fullWidth",
    ].includes(elementType || "");
    let elementContent = content;

    if (isImageType) {
      elementContent = `/images/${elementType}.jpg`;
    }

    // 派發創建元素實例的動作
    dispatch(
      createElementInstance({
        type,
        content: elementContent,
        isLayout: isLayoutType,
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

  return (
    <ToolbarContainer>
      <MainToolbar>
        {toolbarItems.map((item, index) => (
          <Button
            $variant="text"
            key={index}
            onClick={() => handleItemClick(item, index)}
          >
            <item.icon size={24} />
            {/* <ItemLabel>{item.label}</ItemLabel> */}
          </Button>
        ))}
      </MainToolbar>
      {expandedItem !== null && toolbarItems[expandedItem].items && (
        <ExpandedPanel>
          <h3>{toolbarItems[expandedItem].label}</h3>
          <RenderSubItems
            items={toolbarItems[expandedItem].items!}
            parentType={toolbarItems[expandedItem].type}
            onAddElement={handleAddElement}
          />
        </ExpandedPanel>
      )}
    </ToolbarContainer>
  );
};

export default Toolbar;
