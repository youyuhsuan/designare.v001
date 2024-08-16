"use client";
import React from "react";
import styled from "styled-components";

const NavbarWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  width: 100%;
`;

const NavbarBrand = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavbarContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    .desktop,
    .tablet {
      display: none;
    }
  }
  @media (min-width: 769px) and (max-width: 1024px) {
    .desktop,
    .mobile {
      display: none;
    }
  }
  @media (min-width: 1025px) {
    .tablet,
    .mobile {
      display: none;
    }
  }
`;

const NavbarItem = styled.a`
  text-decoration: none;
  color: #333;
  &:hover {
    color: #007bff;
  }
`;

const BreakpointIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PublishButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const Navbar = () => {
  return (
    <NavbarWrapper>
      <NavbarBrand>Designera</NavbarBrand>

      <NavbarContent>
        <NavbarItem href="#" className="desktop">
          Desktop
        </NavbarItem>
        <NavbarItem href="#" className="tablet">
          Tablet
        </NavbarItem>
        <NavbarItem href="#" className="mobile">
          Mobile
        </NavbarItem>
        <div style={{ display: "flex", gap: "8px" }}>
          <BreakpointIcon className="desktop">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M17.5 16h-11A1.502 1.502 0 0 1 5 14.5v-8A1.502 1.502 0 0 1 6.5 5h11A1.502 1.502 0 0 1 19 6.5v8a1.502 1.502 0 0 1-1.5 1.5ZM6.5 6a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.501.501 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-11ZM16 18H8v1h8v-1Z"></path>
            </svg>
          </BreakpointIcon>
          <BreakpointIcon className="tablet">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M15.5 19h-7A1.502 1.502 0 0 1 7 17.5v-11A1.502 1.502 0 0 1 8.5 5h7A1.502 1.502 0 0 1 17 6.5v11a1.502 1.502 0 0 1-1.5 1.5Zm-7-13a.5.5 0 0 0-.5.5v11a.501.501 0 0 0 .5.5h7a.501.501 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5h-7Z"></path>
            </svg>
          </BreakpointIcon>
          <BreakpointIcon className="mobile">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M14.5 18h-5A1.502 1.502 0 0 1 8 16.5v-9A1.502 1.502 0 0 1 9.5 6h5A1.502 1.502 0 0 1 16 7.5v9a1.502 1.502 0 0 1-1.5 1.5Zm-5-11a.5.5 0 0 0-.5.5v9a.501.501 0 0 0 .5.5h5a.501.501 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-5Z"></path>
            </svg>
          </BreakpointIcon>
        </div>
        <NavbarItem href="#">Projects</NavbarItem>
        <NavbarItem href="#">Templates</NavbarItem>
      </NavbarContent>

      <div style={{ display: "flex", gap: "8px" }}>
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
        <PublishButton>Publish</PublishButton>
      </div>
    </NavbarWrapper>
  );
};

export default Navbar;
