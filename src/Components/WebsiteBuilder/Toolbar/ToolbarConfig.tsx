import React from "react";
import styled from "styled-components";
import { FaFont, FaImage, FaColumns, FaShapes, FaList } from "react-icons/fa";
import { RxButton } from "react-icons/rx";

export interface ToolbarSubItem {
  label: string;
  isLayout?: boolean;
  elementType: string;
  content?: string;
}

export interface ToolbarItem {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  isLayout?: boolean;
  items?: ToolbarSubItem[];
  type: string;
  content?: string;
  elementType?: string;
}

export const toolbarItems: ToolbarItem[] = [
  {
    icon: FaFont,
    label: "Text",
    type: "text",
    items: [
      {
        label: "H1",
        elementType: "H1",
        content: "Heading 1",
      },
      {
        label: "H2",
        elementType: "H2",
        content: "Heading 2",
      },
      {
        label: "H3",
        elementType: "H3",
        content: "Heading 3",
      },
      {
        label: "H4",
        elementType: "H4",
        content: "Heading 4",
      },
      {
        label: "H5",
        elementType: "H5",
        content: "Heading 5",
      },
      {
        label: "Paragraph 1",
        elementType: "pre1",
        content: "Paragraph 1",
      },
      {
        label: "Paragraph 2",
        elementType: "pre2",
        content: "Paragraph 2",
      },
      {
        label: "Paragraph 3",
        elementType: "pre3",
        content: "Paragraph 3",
      },
    ],
  },
  {
    icon: FaImage,
    label: "Image",
    type: "image",
    items: [
      {
        label: "Circle",
        elementType: "circle",
      },
      {
        label: "Square",
        elementType: "square",
      },
      {
        label: "4:2 Ratio",
        elementType: "fourTwo",
      },
      {
        label: "4:3 Ratio",
        elementType: "fourThree",
      },
      {
        label: "Full Width",
        elementType: "fullWidth",
      },
    ],
  },
  {
    icon: RxButton,
    label: "ButtonElement",
    type: "buttonElement",
    items: [
      {
        label: "FilledButton",
        elementType: "filledButton",
        content: "Filled Button",
      },
      {
        label: "OutlinedButton",
        elementType: "outlinedButton",
        content: "Outlined Button",
      },
      {
        label: "TextButton",
        elementType: "textButton",
        content: "Text Button",
      },
    ],
  },
  {
    icon: FaColumns,
    label: "Layout",
    type: "layout",
    items: [
      {
        label: "layout",
        isLayout: true,
        elementType: "layout",
      },
      {
        label: "columnized layout",
        isLayout: true,
        elementType: "columnizedLayout",
      },
      {
        label: "Sidebar layout",
        isLayout: true,
        elementType: "sidebarLayout",
      },
      {
        label: "Grid",
        isLayout: true,
        elementType: "grid",
      },
      {
        label: "Freeform",
        isLayout: true,
        elementType: "freeform",
      },
    ],
  },
  {
    icon: FaShapes,
    label: "navbar",
    type: "navbar",
    elementType: "Video",
    content: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];
