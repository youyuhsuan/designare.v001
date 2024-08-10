"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  addElement,
  setActiveElement,
} from "@/src/libs/features/websiteBuilder/websiteBuilderSlice";
import {
  BaseElementData,
  ElementData,
  FreeDraggableElementData,
  LayoutElementData,
} from "@/src/Components/WebsiteBuilder/BuilderInterface";
import {
  FaFont,
  FaImage,
  FaLink,
  FaColumns,
  FaShapes,
  FaList,
} from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
  width: 250px;
  padding: 20px;
  background-color: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  height: 100vh;
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }

  svg {
    margin-right: 10px;
  }
`;

const ToolSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
`;

export function Sidebar() {
  const dispatch = useDispatch();

  const handleAddElement = (
    type: string,
    content: string,
    isLayout: boolean = false
  ) => {
    const baseElement: BaseElementData = {
      id: uuidv4(),
      type,
      content,
      height: 100,
      isLayout,
    };

    let newElement: ElementData;

    if (isLayout) {
      newElement = baseElement as LayoutElementData;
    } else {
      newElement = {
        ...baseElement,
        isLayout: false,
        position: { x: 0, y: 0 },
      } as FreeDraggableElementData;
    }

    console.log("Adding new element:", newElement);

    dispatch(addElement(newElement));
    dispatch(setActiveElement(newElement.id));
  };

  return (
    <Container>
      <ToolSection>
        <SectionTitle>Add Elements</SectionTitle>
        <ToolButton onClick={() => handleAddElement("text", "New Text")}>
          <FaFont size={18} />
          Text
        </ToolButton>
        <ToolButton
          onClick={() =>
            handleAddElement("image", "https://via.placeholder.com/150")
          }
        >
          <FaImage size={18} />
          Image
        </ToolButton>
        <ToolButton onClick={() => handleAddElement("button", "New Button")}>
          <FaLink size={18} />
          Button
        </ToolButton>
      </ToolSection>

      <ToolSection>
        <SectionTitle>Layout</SectionTitle>
        <ToolButton
          onClick={() => handleAddElement("columns", "New Columns", true)}
        >
          <FaColumns size={18} />
          Columns
        </ToolButton>
        <ToolButton
          onClick={() => handleAddElement("container", "New Container", true)}
        >
          <FaShapes size={18} />
          Containers
        </ToolButton>
      </ToolSection>

      <ToolSection>
        <SectionTitle>Components</SectionTitle>
        <ToolButton onClick={() => handleAddElement("list", "New List")}>
          <FaList size={18} />
          List
        </ToolButton>
      </ToolSection>
    </Container>
  );
}

export default Sidebar;
