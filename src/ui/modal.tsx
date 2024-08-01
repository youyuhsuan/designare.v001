"use client";

import { useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

const Dialog = styled.dialog`
  width: 200px;
  padding: 1.25rem; // 20px
  border-radius: 0.5rem; // 8px
  border: none;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1); // 4px 6px
  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(0.3125rem); // 5px
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.625rem; // 10px
  right: 0.625rem; // 10px
  background: none;
  border: none;
  cursor: pointer;
  &:after {
    content: "×";
  }
`;

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  function onDismiss() {
    router.back();
  }

  return createPortal(
    <Dialog ref={dialogRef} onClose={onDismiss}>
      {children}
      <CloseButton onClick={onDismiss} aria-label="Close modal" />
    </Dialog>,
    document.getElementById("modal-root")!
  );
}
