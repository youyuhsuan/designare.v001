"use client";

import React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  BaseElementData,
  GlobalElementType,
  LocalElementType,
} from "@/src/Components/WebsiteBuilder/BuilderInterface/index";

import {
  FaFont,
  FaImage,
  FaLink,
  FaColumns,
  FaShapes,
  FaList,
} from "react-icons/fa";
import styled from "styled-components";
import { useElementContext } from "@/src/Components/WebsiteBuilder/Slider/ElementContext";
import { elementConfigs } from "../SidebarEditor/elementConfigs";
import { useDispatch } from "react-redux";
import { addToElementLibrary } from "@/src/libs/features/websiteBuilder/websiteBuilderSlice";

const Container = styled.div`
  width: 3rem; //48px
  background-color: ${(props) => props.theme.colors.background};
  border-right: 1px solid ${(props) => props.theme.colors.border};
  height: 100dvh;
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;

  border: 0;
  margin-bottom: 10px;
  padding: 10px;

  background-color: ${(props) => props.theme.colors.background};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ToolSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.p`
  font-size: 0.625rem; // 10px
  color: #666;
  margin-bottom: 10px;
`;

export function Toolbar() {
  const { addElement } = useElementContext();
  const dispatch = useDispatch();

  const handleAddElement = (
    type: string,
    content: string,
    isLayout: boolean = false,
    elementType?: string
  ) => {
    // 創建全局元素類型
    const globalElement: GlobalElementType = {
      id: uuidv4(),
      type,
      content,
      isLayout,
      defaultProps: {
        position: isLayout ? undefined : { x: 0, y: 0 },
      },
    };

    // 添加到全局元素庫
    dispatch(addToElementLibrary(globalElement));
    // console.log("Adding new globalElement:", globalElement);

    // 創建本地元素實例
    const baseElement: BaseElementData = {
      id: uuidv4(),
      type,
      content,
    };

    const createLocalElement = (isLayout: boolean): LocalElementType => {
      if (isLayout) {
        const layoutConfig = elementConfigs.layout.properties;
        return {
          ...baseElement,
          isLayout: true,
          config: {
            size: {
              width: layoutConfig.size.defaultValue.width,
              height: layoutConfig.size.defaultValue.height,
            },
            responsiveBehavior: layoutConfig.responsiveBehavior.defaultValue,
            useMaxWidth: layoutConfig.useMaxWidth.defaultValue,
            boxModelEditor: {
              padding: layoutConfig.boxModelEditor.defaultValue.padding,
              margin: layoutConfig.boxModelEditor.defaultValue.margin,
            },
            backgroundColor: {
              defaultColor: layoutConfig.backgroundColor.defaultColor,
              defaultOpacity: layoutConfig.backgroundColor.defaultOpacity,
            },
            media: layoutConfig.media.defaultValue,
          },
        };
      } else {
        const freeDraggableConfig = elementConfigs.freeDraggable.properties;
        const freeDraggableSubtypes = elementConfigs.freeDraggable.subtypes;

        const text = {
          size: freeDraggableSubtypes?.text.properties.size.defaultValue(
            elementType
          ),
          fontSize:
            freeDraggableSubtypes?.text.properties.fontSize.defaultValue(
              elementType
            ),
          fontType:
            freeDraggableSubtypes?.text.properties.fontType.defaultValue(
              elementType
            ),
          textColor:
            freeDraggableSubtypes?.text.properties.textColor.defaultValue,
          letterSpacing:
            freeDraggableSubtypes?.text.properties.letterSpacing.defaultValue,
          lineHeight:
            freeDraggableSubtypes?.text.properties.lineHeight.defaultValue(
              elementType
            ),
          fontFamily:
            freeDraggableSubtypes?.text.properties.fontFamily.defaultValue,
        };

        return {
          ...baseElement,
          isLayout: false,
          config: {
            horizontalAlignment:
              freeDraggableConfig.horizontalAlignment.defaultValue,
            verticalAlignment:
              freeDraggableConfig.verticalAlignment.defaultValue,
            distribution: freeDraggableConfig.distribution.defaultValue,
            position: freeDraggableConfig.position.defaultValue,
            ...(type === "text" ? text : {}),
          },
        };
      }
    };

    const localElement = createLocalElement(isLayout);

    // 添加到本地元素狀態
    addElement(localElement);
    // console.log("Adding new localElement:", localElement);
  };
  return (
    <Container>
      <ToolSection>
        <SectionTitle>Add Elements</SectionTitle>
        <ToolButton
          onClick={() => handleAddElement("text", "Add a Title", false, "H1")}
        >
          <FaFont size={24} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            handleAddElement("image", "https://via.placeholder.com/150")
          }
        >
          <FaImage size={24} />
        </ToolButton>
        <ToolButton onClick={() => handleAddElement("button", "New Button")}>
          <FaLink size={24} />
        </ToolButton>
      </ToolSection>
      <ToolSection>
        <SectionTitle>Layout</SectionTitle>
        <ToolButton
          onClick={() => handleAddElement("columns", "New Columns", true)}
        >
          <FaColumns size={24} />
        </ToolButton>
        <ToolButton
          onClick={() => handleAddElement("container", "New Container", true)}
        >
          <FaShapes size={24} />
        </ToolButton>
      </ToolSection>

      <ToolSection>
        <SectionTitle>Components</SectionTitle>
        <ToolButton onClick={() => handleAddElement("list", "New List")}>
          <FaList size={24} />
        </ToolButton>
      </ToolSection>
    </Container>
  );
}
