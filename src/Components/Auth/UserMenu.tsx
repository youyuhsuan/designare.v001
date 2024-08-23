import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import nullAvatarImg from "@/src/image/nullAvatar.png"; // 確保路徑正確

export interface UserMenuProps {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  onLogout?: () => void;
}

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
`;

const UserAvatarContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 16px;
  min-width: 200px;
  z-index: 1000;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  margin-bottom: 16px;
`;

const Username = styled.h3<UserMenuProps>`
  margin: 8px 0 4px;
  font-size: 18px;
  color: #333;
`;

const UserEmail = styled.p<UserMenuProps>`
  margin: 0;
  font-size: 14px;
  color: #666;
`;

const MenuItem = styled.div`
  padding: 8px 0;
  cursor: pointer;
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: center;

  &:hover {
    color: ${(props) => props.theme.colors.accent};
  }

  svg {
    margin-right: 8px;
  }
`;

const UserMenu: React.FC<UserMenuProps> = ({
  name,
  email,
  avatarUrl,
  onLogout,
}) => {
  const avatarSrc = avatarUrl || nullAvatarImg.src;
  console.log("Avatar URL:", avatarSrc);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <UserMenuContainer ref={dropdownRef}>
      <UserMenuButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <UserAvatarContainer>
          <AvatarImage src={avatarSrc} alt={name || "User avatar"} />
        </UserAvatarContainer>{" "}
      </UserMenuButton>
      {isDropdownOpen && (
        <DropdownMenu>
          <UserInfo>
            <UserAvatarContainer>
              <AvatarImage src={avatarSrc} alt={name || "User avatar"} />
            </UserAvatarContainer>{" "}
            <Username>{name}</Username>
            <UserEmail>{email}</UserEmail>
          </UserInfo>
          <MenuItem>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
                fill="currentColor"
              />
            </svg>
            Dashboard
          </MenuItem>
          <MenuItem onClick={onLogout}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                fill="currentColor"
              />
            </svg>
            Sign out
          </MenuItem>
        </DropdownMenu>
      )}
    </UserMenuContainer>
  );
};

export default UserMenu;
