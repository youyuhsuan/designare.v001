"use client";

import React, { ElementRef, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button } from "@/src/Components/Button";
import DeviceSelector from "../DeviceSelector";
import Link from "next/link";
import { ErrorMessage } from "../Auth/AuthModal.styles";

interface WebsiteBuilderNavbarProps {
  id: string;
  // onPreview: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onPublish: () => Promise<void>;
}

const NavbarWrapper = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: ${(props) => props.theme.colors.background};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const NavbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavbarBrand = styled(Link)`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  color: ${(props) => props.theme.colors.text};
  &:hover {
    background-color: ${(props) => props.theme.button.hover.primary};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Dialog = styled.dialog`
  width: 600px;
  padding: 1.25rem;
  border-radius: 0.5rem;
  border: none;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(0.3125rem);
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const DialogTitle = styled.h2`
  margin-top: 0;
`;

const DialogBody = styled.div`
  padding: 20px;
`;

const StyledLink = styled(Link)`
  color: #0066cc;
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`;

const UrlDisplay = styled.p`
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
`;

const WebsiteBuilderNavbar: React.FC<WebsiteBuilderNavbarProps> = ({
  id,
  // onPreview,
  onUndo,
  onRedo,
  onPublish,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isDialogOpen && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    } else if (!isDialogOpen && dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }, [isDialogOpen]);

  const handlePublishWebsite = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await onPublish();
      if (typeof url === "string") {
        setPublishedUrl(url);
        setIsDialogOpen(true);
      } else {
        throw new Error("Invalid URL returned");
      }
    } catch (err) {
      console.error("Error publishing website:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <NavbarWrapper>
        <NavbarSection>
          <NavbarBrand href="/">Designera</NavbarBrand>
          <DeviceSelector />
        </NavbarSection>
        <NavbarSection>
          <IconButton aria-label="Save">
            <svg viewBox="0 0 24 24" width="20" height="20">
              {/* Save icon */}
            </svg>
          </IconButton>
          {/* <IconButton aria-label="Preview" onClick={onPreview}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
          </svg>
        </IconButton> */}
          <IconButton aria-label="Undo" onClick={onUndo}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12.014 7.003H6.937l2.319-2.287-.701-.712-3.551 3.5 3.55 3.492.7-.713-2.316-2.28h5.076a5 5 0 0 1 0 10L10.002 18 10 19l2.015.003a6 6 0 1 0 0-12Z"></path>
            </svg>
          </IconButton>
          <IconButton aria-label="Redo" onClick={onRedo}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M11.986 7.003h5.077l-2.319-2.287.701-.712 3.551 3.5-3.55 3.492-.7-.713 2.316-2.28h-5.076a5 5 0 1 0 0 10L13.998 18 14 19l-2.015.003a6 6 0 1 1 0-12Z"></path>
            </svg>
          </IconButton>
          <Button
            $variant="filled"
            $color="secondary"
            onClick={handlePublishWebsite}
            disabled={isLoading}
          >
            {isLoading ? "發佈中..." : "發佈"}
          </Button>
        </NavbarSection>
      </NavbarWrapper>

      <Dialog ref={dialogRef} onClose={handleCloseDialog}>
        <Header>
          <DialogTitle>恭喜</DialogTitle>
          <DialogTitle>您的網站已發布並上線</DialogTitle>
        </Header>
        <DialogBody>
          {publishedUrl && (
            <UrlDisplay>
              網站已發佈：
              <StyledLink
                href={publishedUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {publishedUrl}
              </StyledLink>
            </UrlDisplay>
          )}
          {error && <ErrorMessage>錯誤：{error}</ErrorMessage>}
        </DialogBody>
        <Button onClick={() => setIsDialogOpen(false)}>關閉</Button>
      </Dialog>
    </>
  );
};

export default WebsiteBuilderNavbar;
