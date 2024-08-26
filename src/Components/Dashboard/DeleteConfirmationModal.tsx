"use client";

import React, { useState, useRef, useEffect, ElementRef } from "react";
import styled from "styled-components";
import { Button } from "@/src/Components/Button";

const StyledDialog = styled.dialog`
  width: 400px;
  padding: 1.25rem;
  border-radius: 0.5rem;
  border: none;
  background-color: ${(props) => props.theme.colors.background};
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
  color: ${(props) => props.theme.colors.text};
`;

const Title = styled.h2`
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 10px;
`;

const Description = styled.p`
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 20px;
`;

const Warning = styled.div`
  color: ${(props) => props.theme.colors.danger};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.colors.inputBackground};
  border: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.text};
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

interface DeleteConfirmationModalProps {
  websiteName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  websiteName,
  onConfirm,
  onCancel,
  isOpen,
}) => {
  const [inputValue, setInputValue] = useState("");
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;
    if (isOpen && dialogElement && !dialogElement.open) {
      dialogElement.showModal();
    } else if (!isOpen && dialogElement && dialogElement.open) {
      dialogElement.close();
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (inputValue === websiteName) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setInputValue("");
    onCancel();
  };

  return (
    <StyledDialog ref={dialogRef} onClose={handleClose}>
      <CloseButton onClick={handleClose} aria-label="Close">
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
      <Title>刪除項目</Title>
      <Description>此項目將被刪除，包括所有相關的設置。</Description>
      <Warning>警告：此操作不可撤銷，請確認您確定要執行此操作。</Warning>
      <Input
        type="text"
        placeholder={`請輸入網站名稱 ${websiteName} 以繼續：`}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <ButtonGroup>
        <Button onClick={handleClose}>取消</Button>
        <Button onClick={handleConfirm} disabled={inputValue !== websiteName}>
          確認刪除
        </Button>
      </ButtonGroup>
    </StyledDialog>
  );
};

export default DeleteConfirmationModal;
