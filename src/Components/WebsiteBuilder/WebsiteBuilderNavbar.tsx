"use client";

import React from "react";
import styled from "styled-components";
import { Button } from "@/src/Components/Button";
import DeviceSelector from "../DeviceSelector";
import Link from "next/link";

const NavbarWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const NavbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavbarBrand = styled(Link)`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  color: ${(props) => props.theme.colors.text};
  &:hover {
    background-color: ${(props) => props.theme.button.hover.primary};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface WebsiteBuilderNavbarProps {
  // onPreview: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCreate: () => void;
}

const WebsiteBuilderNavbar: React.FC<WebsiteBuilderNavbarProps> = ({
  // onPreview,
  onUndo,
  onRedo,
  onCreate,
}) => {
  return (
    <NavbarWrapper>
      <NavbarSection>
        <NavbarBrand href="/">Designera</NavbarBrand>
        <DeviceSelector />
      </NavbarSection>

      <NavbarSection>
        <IconButton aria-label="Save">
          <svg viewBox="0 0 24 24" width="20" height="20">
            {/* Save icon */}
          </svg>
        </IconButton>
        {/* <IconButton aria-label="Preview" onClick={onPreview}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
          </svg>
        </IconButton> */}
        <IconButton aria-label="Undo" onClick={onUndo}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12.014 7.003H6.937l2.319-2.287-.701-.712-3.551 3.5 3.55 3.492.7-.713-2.316-2.28h5.076a5 5 0 0 1 0 10L10.002 18 10 19l2.015.003a6 6 0 1 0 0-12Z"></path>
          </svg>
        </IconButton>
        <IconButton aria-label="Redo" onClick={onRedo}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M11.986 7.003h5.077l-2.319-2.287.701-.712 3.551 3.5-3.55 3.492-.7-.713 2.316-2.28h-5.076a5 5 0 1 0 0 10L13.998 18 14 19l-2.015.003a6 6 0 1 1 0-12Z"></path>
          </svg>
        </IconButton>

        <Button $variant="filled" $color="secondary" onClick={onCreate}>
          建立
        </Button>
      </NavbarSection>
    </NavbarWrapper>
  );
};

export default WebsiteBuilderNavbar;
