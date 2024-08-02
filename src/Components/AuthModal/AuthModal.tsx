"use client";

import React, { useState, useCallback } from "react";
import { Modal } from "@/src/ui/Modal";
import { AuthProvider } from "@/src/Components/AuthModal/AuthContext";
import { LoginForm } from "@/src/Components/AuthModal/LoginForm";
import { SignupForm } from "@/src/Components/AuthModal/SignupForm";
import { ForgotPasswordForm } from "@/src/Components/AuthModal/ForgotPasswordForm";

export type AuthMode = "login" | "signup" | "forgot-password";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const handleModeChange = useCallback((newMode: AuthMode) => {
    setMode(newMode);
  }, []);

  const renderContent = () => {
    switch (mode) {
      case "login":
        return <LoginForm onModeChange={handleModeChange} />;
      case "signup":
        return <SignupForm onModeChange={handleModeChange} />;
      case "forgot-password":
        return <ForgotPasswordForm onModeChange={handleModeChange} />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AuthProvider>{renderContent()}</AuthProvider>
    </Modal>
  );
}
