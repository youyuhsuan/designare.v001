import React, { useState, useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/libs/hook";
import { clearError, clearMessage } from "@/src/libs/features/auth/authSlice";
import { handleSubmit } from "@/src/libs/features/auth/authThunks";
import {
  selectAuthErrors,
  selectAuthMessage,
} from "@/src/libs/features/auth/authSelectors";
import { Modal } from "@/src/Components/Auth/Modal";
import { LoginForm } from "@/src/Components/Auth/LoginForm";
import { SignupForm } from "@/src/Components/Auth/SignupForm";
import { ForgotPasswordForm } from "@/src/Components/Auth/ForgotPasswordForm";

export type AuthMode = "login" | "signup" | "forgot-password";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onLogin: () => void;
}

export type ErrorsType = { [k: string]: string | null } | null;

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const dispatch = useAppDispatch();
  const errors = useAppSelector(selectAuthErrors) as ErrorsType;
  const message = useAppSelector(selectAuthMessage);
  const [countdown, setCountdown] = useState<number | null>(null);

  const clearState = useCallback(() => {
    dispatch(clearError());
    dispatch(clearMessage());
  }, [dispatch]);

  const handleModeChange = useCallback(
    (newMode: AuthMode) => {
      clearState();
      setMode(newMode);
    },
    [clearState]
  );

  const handleSubmitForm = useCallback(
    async (formData: FormData) => {
      clearState();
      await dispatch(handleSubmit(formData, mode));
    },
    [dispatch, mode, clearState]
  );

  useEffect(() => {
    let refreshTimer: NodeJS.Timeout;
    let countdownTimer: NodeJS.Timeout;

    if (message === "註冊成功" || message === "密碼重置郵件已發送") {
      const clearMessageTimer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000); // 3秒後清除消息

      return () => clearTimeout(clearMessageTimer);
    }

    if (message === "登入成功") {
      setCountdown(5); // 開始5秒倒計時

      countdownTimer = setInterval(() => {
        setCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);

      refreshTimer = setTimeout(() => {
        window.location.reload();
      }, 5000);
    }

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [message, dispatch]);

  // 處理 errors 可能為 null 或包含 null 值的情況
  const safeErrors: Record<string, string> | null = errors
    ? Object.fromEntries(
        Object.entries(errors).filter(
          (entry): entry is [string, string] => entry[1] !== null
          //  is 類型謹慎 Type Predicate
          //  Object.entries(errors) 產生的 [key, value]
          //  entry is [stritring]，這表示當函數返回 true 時，entry 的類型應該被視為 [string, string]
          //  [['key', 'value'], ['key', 'value']]
        )
        //  鍵值對組成的 Array轉換為 Object
        //  {
        //    key: 'value',
        //    key: 'value'
        //  }
      )
    : null;

  const renderContent = () => {
    switch (mode) {
      case "login":
        return (
          <LoginForm
            onModeChange={handleModeChange}
            onSubmit={handleSubmitForm}
            errors={safeErrors}
            message={message}
          />
        );
      case "signup":
        return (
          <SignupForm
            onModeChange={handleModeChange}
            onSubmit={handleSubmitForm}
            errors={safeErrors}
            message={message}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordForm
            onModeChange={handleModeChange}
            onSubmit={handleSubmitForm}
            errors={safeErrors}
            message={message}
          />
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {renderContent()}
    </Modal>
  );
}
