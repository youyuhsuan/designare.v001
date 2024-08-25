"use client";

import React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  BaseElementData,
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
import { useAppDispatch } from "@/src/libs/hook";
import { StyledButton } from "@/src/Components/Button";
import { createElementInstance } from "@/src/libs/features/websiteBuilder/elementLibrarySlice";

interface HandleAddElementParams {
  type: string;
  content: any;
  isLayout?: boolean;
  elementType?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.colors.background};
  border-right: 1px solid ${(props) => props.theme.colors.border};
`;

const ToolButton = styled(StyledButton).attrs({
  $variant: "text",
  $color: "primary",
  $size: "medium",
})`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

const ToolSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.p`
  font-size: 0.625rem; // 10px
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 10px;
`;

export function Toolbar() {
  const dispatch = useAppDispatch();
  const handleAddElement = ({
    type,
    content,
    isLayout = false,
    elementType,
  }: HandleAddElementParams) => {
    dispatch(createElementInstance({ type, content, isLayout, elementType }));
  };

  return (
    <Container>
      <ToolSection>
        <SectionTitle>Add Elements</SectionTitle>
        <ToolButton
          onClick={() =>
            handleAddElement({
              type: "text",
              content: "Add a Title",
              isLayout: false,
              elementType: "H1",
            })
          }
        >
          <FaFont size={24} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            handleAddElement({
              type: "image",
              content: "https://via.placeholder.com/150",
            })
          }
        >
          <FaImage size={24} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            handleAddElement({ type: "button", content: "New Button" })
          }
        >
          <FaLink size={24} />
        </ToolButton>
      </ToolSection>
      <ToolSection>
        <SectionTitle>Layout</SectionTitle>
        <ToolButton
          onClick={() =>
            handleAddElement({
              type: "columns",
              content: "New Columns",
              isLayout: true,
            })
          }
        >
          <FaColumns size={24} />
        </ToolButton>
        <ToolButton
          onClick={() =>
            handleAddElement({
              type: "container",
              content: "New Container",
              isLayout: true,
            })
          }
        >
          <FaShapes size={24} />
        </ToolButton>
      </ToolSection>

      <ToolSection>
        <SectionTitle>Components</SectionTitle>
        <ToolButton
          onClick={() =>
            handleAddElement({ type: "list", content: "New List" })
          }
        >
          <FaList size={24} />
        </ToolButton>
      </ToolSection>
    </Container>
  );
}
