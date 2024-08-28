"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "@/src/libs/hook";
import { createElementInstance } from "@/src/libs/features/websiteBuilder/elementLibrarySlice";
import { selectPresent } from "@/src/libs/features/websiteBuilder/historySelector";
import { addToHistory } from "@/src/libs/features/websiteBuilder/historySlice";
import { toolbarItems, ToolbarItem, ToolbarSubItem } from "./ToolbarConfig";
import Image from "next/image";
import { StaticImageData } from "next/image";

import Circle from "@/public/images/Circle.jpg";
import Square from "@/public/images/Square.jpg";
import FourTwo from "@/public/images/FourTwo.jpg";
import FourThree from "@/public/images/FourThree.jpg";
import FullWidth from "@/public/images/FullWidth.jpg";
import { Button } from "../../Button";

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

const SubItemButton = styled.button<{
  $elementType: string;
  backgroundImage?: string;
}>`
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 4px;
  text-align: left;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  ${({ $elementType }) => {
    switch ($elementType) {
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
      case "circle":
      case "square":
        return `
          position: relative;
          height: 100px;
          width: 100px;
          overflow: hidden;
          ${$elementType === "circle" ? "border-radius: 50%;" : ""}
        `;
      case "fourTwo":
        return `
          position: relative;
          height: 100px;
          width: 50%;
          overflow: hidden;
        `;
      case "fourThree":
        return `
          position: relative;
          height: 100px;
          width: 75%;
          overflow: hidden;
        `;
      case "fullWidth":
        return `
          position: relative;
          height: 100px;
          width: 100%;
          overflow: hidden;
        `;
      default:
        return ``;
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
    const isImageType = [
      "circle",
      "square",
      "fourTwo",
      "fourThree",
      "fullWidth",
    ].includes(elementType || "");
    let elementContent = content;

    if (isImageType) {
      // 如果是圖片類型，我們傳遞圖片的路徑而不是類型名稱
      elementContent = `/images/${elementType}.jpg`;
    }

    // 派發創建元素實例的動作
    dispatch(
      createElementInstance({
        type,
        content: elementContent,
        isLayout,
        elementType,
      })
    );
    // 更新歷史記錄
    const updatedState = { ...presentState };
    dispatch(addToHistory(updatedState));
  };

  const getImageSrc = (elementType: string): StaticImageData => {
    switch (elementType) {
      case "circle":
        return Circle;
      case "square":
        return Square;
      case "fourTwo":
        return FourTwo;
      case "fourThree":
        return FourThree;
      case "fullWidth":
        return FullWidth;
      default:
        return Circle;
    }
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
    return items.map((item, index) => {
      const elementType = item.elementType || parentType;
      const isImageType = [
        "circle",
        "square",
        "fourTwo",
        "fourThree",
        "fullWidth",
      ].includes(elementType);
      const imageSrc = isImageType ? getImageSrc(elementType) : null;
      return (
        <SubItemButton
          key={index}
          $elementType={elementType}
          onClick={() =>
            handleAddElement({
              type: parentType,
              content: item.content || item.label,
              elementType: elementType,
            })
          }
        >
          {isImageType && imageSrc ? (
            <>
              <Image
                src={imageSrc}
                alt={item.label}
                layout="fill"
                objectFit="cover"
              />
            </>
          ) : (
            item.label
          )}
        </SubItemButton>
      );
    });
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
