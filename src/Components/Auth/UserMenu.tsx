import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  padding: 0.5rem 0;
  min-width: 200px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

interface UserMenuProps {
  userEmail: string;
  onLogout: () => void;
}

export function UserMenu({ userEmail, onLogout }: UserMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <UserMenuContainer ref={dropdownRef}>
      <UserMenuButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <UserAvatar>{userEmail.charAt(0).toUpperCase()}</UserAvatar>
        {userEmail}
      </UserMenuButton>
      {isDropdownOpen && (
        <DropdownMenu>
          <DropdownItem>
            <Link href="/profile">Profile</Link>
          </DropdownItem>
          <DropdownItem>
            <Link href="/settings">設定</Link>
          </DropdownItem>
          <DropdownItem onClick={onLogout}>登出</DropdownItem>
        </DropdownMenu>
      )}
    </UserMenuContainer>
  );
}
