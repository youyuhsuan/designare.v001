import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/libs/store";
import styled from "styled-components";
import {
  FaFont,
  FaImage,
  FaLink,
  FaColumns,
  FaShapes,
  FaList,
} from "react-icons/fa";
import {
  addFreeDraggableElement,
  setActiveElement,
} from "@/src/libs/features/websiteBuilder/websiteBuilderSlice";
import { v4 } from "uuid";

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
  const activeElementId = useSelector(
    (state: RootState) => state.websiteBuilder.activeElementId
  );

  const handleAddElement = (type: string, content: string) => {
    const newElement = {
      id: v4(),
      type,
      content,
      height: 100,
      isLayout: false,
      position: { x: 0, y: 0 },
    };
    dispatch(addFreeDraggableElement(newElement));
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
        <ToolButton onClick={() => handleAddElement("columns", "New Columns")}>
          <FaColumns size={18} />
          Columns
        </ToolButton>
        <ToolButton
          onClick={() => handleAddElement("container", "New Container")}
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
