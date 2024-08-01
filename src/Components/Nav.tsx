"use client";

import Link from "next/link";
import styled from "styled-components";

const Navbar = styled.nav`
  width: 100%;
  padding: 1rem 0;
`;

const NavbarContent = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
`;

const NavbarBrand = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavbarItems = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavbarItem = styled.div`
  a {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const NavbarLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default function Nav() {
  return (
    <Navbar>
      <NavbarContent>
        <NavbarBrand>
          <NavbarLink href="/">Designare</NavbarLink>
        </NavbarBrand>
        <NavbarItems>
          <NavbarItem>
            <NavbarLink href="/about">About</NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <NavbarLink href="/services">Services</NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <NavbarLink href="/contact">Contact</NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <NavbarLink href="/login">Login</NavbarLink>
          </NavbarItem>
        </NavbarItems>
      </NavbarContent>
    </Navbar>
  );
}
