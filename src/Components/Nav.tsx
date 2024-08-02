"use client";

import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import { AuthModal } from "@/src/Components/AuthModal/AuthModal";

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<
    "login" | "signup" | "forgot-password"
  >("login");

  const openAuthModal = (mode: "login" | "signup" | "forgot-password") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);
  return (
    <Navbar>
      <NavbarContent>
        <NavbarBrand>
          <NavbarLink href="/">Designare</NavbarLink>
        </NavbarBrand>
        <NavbarItems>
          <NavbarItem>
            <NavbarLink href="/about">關於</NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <NavbarLink href="/services">服務</NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <NavbarLink href="/contact">聯絡</NavbarLink>
          </NavbarItem>
          <NavbarItem>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openAuthModal("login");
              }}
            >
              登入
            </a>
          </NavbarItem>
          <NavbarItem>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openAuthModal("signup");
              }}
            >
              註冊
            </a>
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={closeAuthModal}
              initialMode={authMode}
            />
          </NavbarItem>
        </NavbarItems>
      </NavbarContent>
    </Navbar>
  );
}
