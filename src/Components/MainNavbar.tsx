"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AuthModal } from "@/src/Components/Auth/AuthModal";
import { useToken } from "@/src/utilities/token";
import { UserMenu } from "./Auth/UserMenu";

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

interface TokenData {
  tokenId: string;
  userId: string;
  username: string;
  userEmail: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  expiresAt: {
    seconds: number;
    nanoseconds: number;
  };
}

function MainNav() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<
    "login" | "signup" | "forgot-password"
  >("login");
  const { token, isLoading, error } = useToken();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  console.log("MainNav token", token);

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
            <UserMenu userEmail={token.userEmail} onLogout={handleLogout} />
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
