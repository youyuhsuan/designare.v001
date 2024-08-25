"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { AuthModal } from "@/src/Components/Auth/AuthModal";
import UserMenu from "@/src/Components/Auth/UserMenu";
import { useAppDispatch, useAppSelector } from "@/src/libs/hook";
import { logout, fetchToken } from "@/src/libs/features/auth/tokenActions";

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
  const dispatch = useAppDispatch();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<
    "login" | "signup" | "forgot-password"
  >("login");

  const openAuthModal = (mode: "login" | "signup" | "forgot-password") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const { token, loading, error } = useAppSelector((state) => state.token);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    let ignore = false;

    const getToken = async () => {
      try {
        if (!token && !ignore) {
          await dispatch(fetchToken()).unwrap();
        }
      } catch (err) {
        console.error("Failed to fetch token:", err);
      }
    };

    getToken();

    return () => {
      ignore = true;
    };
  }, [dispatch, token]);

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  const handleLogin = () => {
    closeAuthModal();
    dispatch(fetchToken());
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
                  onLogin={handleLogin}
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
