"use client";

import React, { ElementRef, useEffect, useRef } from "react";
import styled from "styled-components";

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

const CloseButton = styled.button`
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  background: none;
  border: none;
  cursor: pointer;
`;

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function Modal({ children, isOpen, onClose }: ModalProps) {
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (isOpen && dialogElement && !dialogElement.open) {
      dialogElement.showModal();
    } else if (!isOpen && dialogElement && dialogElement.open) {
      dialogElement.close();
    }
  }, [isOpen]);

  function handleClose() {
    onClose();
  }

  return (
    <Dialog ref={dialogRef} onClose={handleClose}>
      {children}
      <CloseButton
        role="button"
        aria-label="Close"
        type="button"
        data-focus-visible="true"
        onClick={handleClose}
      >
        <svg
          aria-hidden="true"
          fill="none"
          focusable="false"
          height="1em"
          role="presentation"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="1em"
        >
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      </CloseButton>
    </Dialog>
  );
}
