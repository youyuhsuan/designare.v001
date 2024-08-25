"use client";

import React from "react";
import styled from "styled-components";
import DeviceSelector from "../DeviceSelector";
import WebsiteListButton from "./WebsiteListButton";

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

const WebsiteBuilderNavbar = () => {
  return (
    <NavbarWrapper>
      <NavbarSection>
        <NavbarBrand>Designera</NavbarBrand>
        <DeviceSelector />
      </NavbarSection>
      <NavbarSection>
        <WebsiteListButton></WebsiteListButton>
      </NavbarSection>
    </NavbarWrapper>
  );
};

export default WebsiteBuilderNavbar;
