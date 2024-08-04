"use client";

import Link from "next/link";
import React, { useCallback, useRef, useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { AuthMode } from "@/src/Components/AuthModal/AuthModal";
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
import { PasswordInput } from "@/src/Components/AuthModal/PasswordInput";
import { Button } from "@/src/Components/Theme";

interface LoginFormProps {
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  errors: Record<string, string> | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onModeChange,
  onSubmit,
  errors,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        if (formRef.current) {
          await onSubmit(new FormData(formRef.current));
        }
      } catch (error) {
        console.error("LoginForm handleSubmit error", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
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
          {errors?.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </Wrapper>
        <PasswordInput
          label="密碼"
          name="password"
          id="password"
          placeholder="請輸入密碼..."
          value={formData.password}
          onChange={handleChange}
        />
        {errors?.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        <ForgotPasswordWrapper>
          <ForgotPassword
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onModeChange("forgot-password");
            }}
          >
            忘記密碼？
          </ForgotPassword>
        </ForgotPasswordWrapper>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "登入中..." : "登入"}
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
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onModeChange("signup");
            }}
          >
            立即註冊
          </Link>
        </span>
      </Footer>
    </>
  );
};
