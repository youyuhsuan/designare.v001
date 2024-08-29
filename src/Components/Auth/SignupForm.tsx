"use client";

import Link from "next/link";
import React, { useCallback, useRef, useState } from "react";
import { AuthMode, ErrorsType } from "@/src/Components/Auth/AuthModal";
import {
  Title,
  Input,
  Wrapper,
  Label,
  Footer,
  ErrorMessage,
  SuccessMessage,
} from "@/src/Components/Auth/AuthModal.styles";
import { PasswordInput } from "@/src/Components/Auth/PasswordInput";
import { Button } from "@/src/Components/Button";

interface SignupFormProps {
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  errors: ErrorsType;
  message: string | null;
  //  {
  //    [key: string]: string;
  //  }
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onModeChange,
  onSubmit,
  errors,
  message,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  // ref object 變動了也不會造成畫面的 re-render，是完全隔絕於 component life cycle 外的狀態
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 禁用提交按鈕，防止用户重複點擊
  // 加载指示
  // 避免重複提交
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // (prev) 當前的 formData值
    // { ...prev, [name]: value } ...prev 表示預設狀態賦予新的 input中
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        if (formRef.current) {
          await onSubmit(new FormData(formRef.current));
          // formRef.current 是DOM 元素
          // new FormData(formElement) 指定的form 元素中提取所有內容
          setFormData({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (error) {
        console.error("Signup handleSubmit error", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );
  //  useCallback [onSubmit]依賴的值變化，function 才会被重建

  return (
    <>
      <Title>建立帳號</Title>
      <form ref={formRef} onSubmit={handleSubmit}>
        <Wrapper>
          <Label htmlFor="username">用戶名</Label>
          <Input
            id="username"
            name="username"
            type="text"
            placeholder="請輸入用戶名..."
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors?.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        </Wrapper>
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
        <PasswordInput
          label="確認密碼"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="請再次輸入密碼..."
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {errors?.confirmPassword && (
          <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
        )}
        {message && <SuccessMessage>{message}</SuccessMessage>}
        {errors?.global && <ErrorMessage>{errors.global}</ErrorMessage>}
        <Button type="submit" disabled={isSubmitting} $fullWidth>
          {isSubmitting ? "註冊中..." : "註冊"}
        </Button>
      </form>
      <Footer>
        <span>
          已經有帳號了？
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onModeChange("login");
            }}
          >
            登入
          </Link>
        </span>
      </Footer>
    </>
  );
};
