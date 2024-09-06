import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import Circle from "@/public/images/Circle.jpg";
import Square from "@/public/images/Square.jpg";
import FourTwo from "@/public/images/FourTwo.jpg";
import FourThree from "@/public/images/FourThree.jpg";
import FullWidth from "@/public/images/FullWidth.jpg";
import { ToolbarSubItem } from "./ToolbarConfig";
import { styled } from "styled-components";
import { LayoutPreview } from "./LayoutPreview";

interface HandleAddElementParams {
  type: string;
  content: any;
  isLayout?: boolean;
  elementType: string;
}

const Button = styled.button<{
  $elementType: string;
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
      case "filledButton":
        return `
          position: relative;
          height: 38px;
          width: 100%;
          overflow: hidden;
          background-color: #252525; 
          color: #ffffff; 
        `;
      case "outlinedButton":
        return `
          position: relative;
          height: 38px;
          width: 100%;
          overflow: hidden;
          border: 2px solid #252525; 
          background: transparent; 
          color: #252525;
        `;
      case "textButton":
        return `
          position: relative;
          height: 38px;
          width: 100%;
          overflow: hidden;
          background: transparent;
          color: #252525; 
        `;
      default:
        return `
          position: relative;
          height: 38px;
          width: 100%;
          overflow: hidden;
          background-color: #ffffff; 
          color: #000000; 
        `;
    }
  }}
`;

const SubItemButton = styled.button<{
  $elementType: string;
}>`
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 4px;
  text-align: left;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
`;

interface RenderStrategy {
  condition: (item: ToolbarSubItem, elementType: string) => boolean;
  render: (
    item: ToolbarSubItem,
    elementType: string,
    imageSrc: StaticImageData | null
  ) => React.ReactNode;
}

const getImageSrc = (elementType: string): StaticImageData => {
  const imageSources = {
    circle: Circle,
    square: Square,
    fourTwo: FourTwo,
    fourThree: FourThree,
    fullWidth: FullWidth,
  };
  return imageSources[elementType as keyof typeof imageSources] || Circle;
};

const renderStrategies: RenderStrategy[] = [
  {
    condition: (item, elementType) =>
      ["circle", "square", "fourTwo", "fourThree", "fullWidth"].includes(
        elementType
      ),
    render: (item, elementType) => (
      <Image
        src={getImageSrc(elementType)}
        alt={item.label}
        layout="fill"
        objectFit="cover"
      />
    ),
  },
  {
    condition: (item, elementType) =>
      ["filledButton", "outlinedButton", "textButton"].includes(elementType),
    render: (item, elementType) => (
      <Button $elementType={elementType}>{item.label}</Button>
    ),
  },
  {
    condition: (item, elementType) =>
      ["layout", "sidebarLayout", "columnizedLayout", "gridLayout"].includes(
        elementType
      ),
    render: (item, elementType) => (
      <LayoutPreview type={elementType}>{item.label}</LayoutPreview>
    ),
  },
  {
    condition: () => true,
    render: (item) => item.label,
  },
];

const RenderSubItem: React.FC<{
  item: ToolbarSubItem;
  parentType: string;
  onAddElement: (params: HandleAddElementParams) => void;
}> = ({ item, parentType, onAddElement }) => {
  const elementType = item.elementType || parentType;

  const strategy = renderStrategies.find((s) => s.condition(item, elementType));

  const content = strategy?.render(item, elementType, null);

  const handleClick = () => {
    onAddElement({
      type: parentType,
      content: item.content || item.label,
      elementType: elementType,
    });
  };

  // 如果是按鈕類型，直接返回渲染的內容，不需要額外的 SubItemButton 包裹
  if (["filledButton", "outlinedButton", "textButton"].includes(elementType)) {
    return <div onClick={handleClick}>{content}</div>;
  }

  // 對於其他類型，仍然使用 SubItemButton
  return (
    <SubItemButton $elementType={elementType} onClick={handleClick}>
      {content}
    </SubItemButton>
  );
};

const RenderSubItems: React.FC<{
  items: ToolbarSubItem[];
  parentType: string;
  onAddElement: (params: HandleAddElementParams) => void;
}> = ({ items, parentType, onAddElement }) => {
  return (
    <>
      {items.map((item, index) => (
        <RenderSubItem
          key={index}
          item={item}
          parentType={parentType}
          onAddElement={onAddElement}
        />
      ))}
    </>
  );
};

export default RenderSubItems;
