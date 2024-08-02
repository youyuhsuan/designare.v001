"use client";

import React, { useCallback, useRef, useState } from "react";
import { AuthMode } from "@/src/Components/AuthModal/AuthModal";
import { useAuthForm } from "@/src/Components/AuthModal/AuthContext";
import {
  Title,
  Input,
  Wrapper,
  Label,
  ForgotPasswordWrapper,
  ForgotPassword,
  Divider,
  Footer,
  ErrorMessage,
} from "@/src/Components/AuthModal/AuthModal.styles";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { PasswordInput } from "@/src/Components/AuthModal/PasswordInput";
import { Button } from "@/src/Components/Theme";
import Link from "next/link";

interface LoginFormProps {
  onModeChange: (mode: AuthMode) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onModeChange }) => {
  const {
    formRef,
    handleSubmit: authHandleSubmit,
    authState,
    setError,
    clearError,
  } = useAuthForm();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      clearError();
      try {
        await authHandleSubmit(e, "login");
        console.log("登入成功");
      } catch (error) {
        console.error("登入失敗", error);
        // if (error instanceof Error) {
        //   setError(error.message);
        // } else {
        //   setError("登入失敗，請稍後再試");
        // }
      }
    },
    [authHandleSubmit, clearError, setError]
  );

  return (
    <>
      <Title>歡迎回來！</Title>
      <form ref={formRef} onSubmit={handleSubmit}>
        <Wrapper>
          <Label htmlFor="email">電子郵件</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="請輸入電子郵件..."
            value={formData.email}
            onChange={handleChange}
            required
          />
          {authState.error && authState.error.includes("email") && (
            <ErrorMessage>{authState.error}</ErrorMessage>
          )}
        </Wrapper>
        <PasswordInput
          label="密碼"
          name="password"
          id="password"
          placeholder="請輸入密碼..."
          value={formData.password}
          onChange={handleChange}
        />
        {authState.error && authState.error.includes("password") && (
          <ErrorMessage>{authState.error}</ErrorMessage>
        )}
        <ForgotPasswordWrapper>
          <ForgotPassword
            href="#"
            onClick={() => onModeChange("forgot-password")}
          >
            忘記密碼？
          </ForgotPassword>
        </ForgotPasswordWrapper>
        <Button type="submit" ref={submitButtonRef}>
          登入
        </Button>
      </form>
      <Divider>
        <span>或</span>
      </Divider>
      <Button>
        <FaGoogle /> Google 登入
      </Button>
      <Button>
        <FaFacebook /> Facebook 登入
      </Button>
      <Footer>
        <span>
          還沒有帳號？
          <Link href="#" onClick={() => onModeChange("signup")}>
            立即註冊
          </Link>
        </span>
      </Footer>
    </>
  );
};
