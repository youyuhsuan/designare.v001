"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AuthModal } from "@/src/Components/Auth/AuthModal";
import { getSessionData } from "../utilities/session";
import { UserMenu } from "./Auth/UserMenu";

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

function MainNav() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<
    "login" | "signup" | "forgot-password"
  >("login");
  const [session, setSession] = useState<null | { userEmail: string }>(null);

  const openAuthModal = (mode: "login" | "signup" | "forgot-password") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        setSession(null);
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
          {session ? (
            <UserMenu userEmail={session.userEmail} onLogout={handleLogout} />
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
