"use client";

import React from "react";
import styled from "styled-components";
import { Button } from "../Button";

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

const NavbarBrand = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

const DeviceSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.background};
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

const WebsiteBuilderNavbar = () => {
  return (
    <NavbarWrapper>
      <NavbarSection>
        <NavbarBrand>Designera</NavbarBrand>
        <DeviceSelector>
          <IconButton aria-label="Desktop">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M17.5 16h-11A1.502 1.502 0 0 1 5 14.5v-8A1.502 1.502 0 0 1 6.5 5h11A1.502 1.502 0 0 1 19 6.5v8a1.502 1.502 0 0 1-1.5 1.5ZM6.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.501.501 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-11ZM16 18H8v1h8v-1Z"></path>
            </svg>
          </IconButton>
          <IconButton aria-label="Tablet">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M15.5 19h-7A1.502 1.502 0 0 1 7 17.5v-11A1.502 1.502 0 0 1 8.5 5h7A1.502 1.502 0 0 1 17 6.5v11a1.502 1.502 0 0 1-1.5 1.5Zm-7-13a.5.5 0 0 0-.5.5v11a.501.501 0 0 0 .5.5h7a.501.501 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-7Z"></path>
            </svg>
          </IconButton>
          <IconButton aria-label="Mobile">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M17.5 16h-11A1.502 1.502 0 0 1 5 14.5v-8A1.502 1.502 0 0 1 6.5 5h11A1.502 1.502 0 0 1 19 6.5v8a1.502 1.502 0 0 1-1.5 1.5ZM6.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.501.501 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-11ZM16 18H8v1h8v-1Z"></path>
            </svg>
          </IconButton>
        </DeviceSelector>
      </NavbarSection>

      <NavbarSection>
        <IconButton aria-label="Save">
          <svg viewBox="0 0 24 24" width="20" height="20">
            {/* Save icon */}
          </svg>
        </IconButton>
        <IconButton aria-label="Preview">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
          </svg>
        </IconButton>
        <IconButton aria-label="Undo">
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12.014 7.003H6.937l2.319-2.287-.701-.712-3.551 3.5 3.55 3.492.7-.713-2.316-2.28h5.076a5 5 0 0 1 0 10L10.002 18 10 19l2.015.003a6 6 0 1 0 0-12Z"></path>
          </svg>
        </IconButton>
        <IconButton aria-label="Redo" disabled>
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M11.986 7.003h5.077l-2.319-2.287.701-.712 3.551 3.5-3.55 3.492-.7-.713 2.316-2.28h-5.076a5 5 0 1 0 0 10L13.998 18 14 19l-2.015.003a6 6 0 1 1 0-12Z"></path>
          </svg>
        </IconButton>

        <Button $variant="filled" $color="secondary">
          建立
        </Button>
      </NavbarSection>
    </NavbarWrapper>
  );
};

export default WebsiteBuilderNavbar;
