"use client";

import React from "react";
import { useAuthForm } from "@/src/Components/AuthModal/AuthContext";
import {
  Title,
  Input,
  Wrapper,
  Label,
  Footer,
} from "@/src/Components/AuthModal/AuthModal.styles";
import { AuthMode } from "@/src/Components/AuthModal/AuthModal";
import { Button } from "@/src/Components/Theme";
import Link from "next/link";

interface ForgotPasswordFormProps {
  onModeChange: (mode: AuthMode) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onModeChange,
}) => {
  const { formRef, handleSubmit } = useAuthForm();

  return (
    <>
      <Title>重設密碼</Title>
      <form>
        <Wrapper>
          <Label htmlFor="Email">電子郵件</Label>
          <Input
            type="email"
            name="email"
            placeholder="請輸入您的電子郵件..."
            required
          />
        </Wrapper>
        <Button type="submit">發送重設密碼郵件</Button>
      </form>
      <Footer>
        <span>
          想起密碼了？
          <Link href="#" onClick={() => onModeChange("login")}>
            返回登入
          </Link>
        </span>
      </Footer>
    </>
  );
};
