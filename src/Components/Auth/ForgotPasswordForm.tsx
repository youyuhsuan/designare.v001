"use client";

import Link from "next/link";
import React, { useCallback, useRef, useState } from "react";
import { AuthMode } from "@/src/Components/Auth/AuthModal";
import {
  Title,
  Input,
  Wrapper,
  Label,
  Footer,
  ErrorMessage,
  SuccessMessage,
} from "@/src/Components/Auth/AuthModal.styles";
import { Button } from "@/src/Components/Button";

interface ForgotPasswordFormProps {
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  errors: Record<string, string> | null;
  message: string | null;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onModeChange,
  onSubmit,
  errors,
  message,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
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
          setFormData({ email: "" });
        }
      } catch (error) {
        console.error("ForgotPasswordForm handleSubmit error", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );

  return (
    <>
      <Title>重設密碼</Title>
      <form ref={formRef} onSubmit={handleSubmit}>
        <Wrapper>
          <Label htmlFor="email">電子郵件</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="請輸入您的電子郵件..."
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors?.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </Wrapper>
        {message && <SuccessMessage>{message}</SuccessMessage>}
        {errors?.global && <ErrorMessage>{errors.global}</ErrorMessage>}
        <Button type="submit" disabled={isSubmitting} $fullWidth>
          {isSubmitting ? "發送中..." : "發送重設密碼郵件"}
        </Button>
      </form>
      <Footer>
        <span>
          想起密碼了？
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onModeChange("login");
            }}
          >
            返回登入
          </Link>
        </span>
      </Footer>
    </>
  );
};
