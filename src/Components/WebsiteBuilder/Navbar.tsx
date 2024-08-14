"use client";

import React from "react";
import styled from "styled-components";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { EyeIcon, ChevronDownIcon } from "@nextui-org/shared-icons";

const StyledNavbar = styled(NextUINavbar)`
  background-color: #000000;
  color: #ffffff;
  padding: 0 1rem;
`;

const NavbarLeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const NavbarRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled(Button)`
  background: transparent;
  color: #ffffff;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Navbar: React.FC = () => {
  return (
    <StyledNavbar maxWidth="full" position="static">
      <NavbarLeftSection>
        <NavbarBrand>
          <p className="font-bold text-inherit">Website Builder</p>
        </NavbarBrand>
        <Dropdown>
          <DropdownTrigger>
            <Button auto light endContent={<ChevronDownIcon />}>
              Home
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Pages">
            <DropdownItem key="home">Home</DropdownItem>
            <DropdownItem key="about">About</DropdownItem>
            <DropdownItem key="contact">Contact</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarLeftSection>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Projects
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Templates
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarRightSection>
        <IconButton isIconOnly aria-label="Preview">
          <EyeIcon />
        </IconButton>

        <Button color="primary" variant="flat">
          Publish
        </Button>
      </NavbarRightSection>
    </StyledNavbar>
  );
};

export default Navbar;
