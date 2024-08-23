"use client";

import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import { AuthModal } from "@/src/Components/Auth/AuthModal";
import { useToken } from "@/src/hook/useToken";
import UserMenu from "@/src/Components/Auth/UserMenu";

const Navbar = styled.nav`
  width: 100%;
  padding: 1rem 0;
  z-index: 10;
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
  gap: 2rem;
`;

const NavbarItem = styled.div`
  height: 100%;
  text-space: 0.2rem;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const NavbarLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

function MainNav() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<
    "login" | "signup" | "forgot-password"
  >("login");
  const { token, loading, error, refreshToken, removeToken } = useToken();

  const openAuthModal = (mode: "login" | "signup" | "forgot-password") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        console.error("Logout failed");
        // setToken(null);
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <Navbar>
      <NavbarContent>
        <NavbarBrand>
          <NavbarLink href="/">Designare</NavbarLink>
        </NavbarBrand>
        <NavbarItems>
          {token ? (
            <UserMenu
              name={token.user.name}
              email={token.user.email}
              avatarUrl={token.user.avatarUrl}
              onLogout={handleLogout}
            />
          ) : (
            <>
              <NavbarItem>
                <NavbarLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openAuthModal("login");
                  }}
                >
                  登入
                </NavbarLink>
              </NavbarItem>
              <NavbarItem>
                <NavbarLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    openAuthModal("signup");
                  }}
                >
                  註冊
                </NavbarLink>
                <AuthModal
                  isOpen={isAuthModalOpen}
                  onClose={closeAuthModal}
                  initialMode={authMode}
                />
              </NavbarItem>
            </>
          )}
        </NavbarItems>
      </NavbarContent>
    </Navbar>
  );
}

export default MainNav;
