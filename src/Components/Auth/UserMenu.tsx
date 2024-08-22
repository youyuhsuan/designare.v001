import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";

const UserMenuContainer = styled.div`
  position: relative;
  z-index: 10;
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
  width: 2.5rem // 40px;
  height:2.5rem // 40px;
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
  box-shadow: 0 2px 10px ${({ theme }) => theme.colors.shadow};
`;

const DropdownItem = styled.div`
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.button.hover.primary};
  }
`;

interface UserMenuProps {
  userEmail: string;
  // username: string;
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
        <UserAvatar />
      </UserMenuButton>
      {isDropdownOpen && (
        <DropdownMenu>
          <DropdownItem>
            <Link href="/profile">Profile</Link>
          </DropdownItem>
          <DropdownItem onClick={onLogout}>登出</DropdownItem>
        </DropdownMenu>
      )}
    </UserMenuContainer>
  );
}
