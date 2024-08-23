"use client";

import Link from "next/link";
import React, { useCallback, useRef, useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { AuthMode } from "@/src/Components/Auth/AuthModal";
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
  ButtonWrapper,
  SuccessMessage,
} from "@/src/Components/Auth/AuthModal.styles";
import { PasswordInput } from "@/src/Components/Auth/PasswordInput";
import { Button } from "@/src/Components/Button";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { firebase_auth } from "@/src/config/firebaseClient";

interface LoginFormProps {
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (formData: FormData) => Promise<void>;
  errors: Record<string, string> | null;
  message: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onModeChange,
  onSubmit,
  errors,
  message,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setGoogleSubmitting] = useState(false);
  const [isFacebookSubmitting, setFacebookSubmitting] = useState(false);

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
          setFormData({ email: "", password: "" });
        }
      } catch (error) {
        console.error("LoginForm handleSubmit error", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSubmit]
  );

  const handleProviderLogin = async (provider: "google" | "facebook") => {
    provider === "google"
      ? setGoogleSubmitting(true)
      : setFacebookSubmitting(true);
    try {
      const authProvider =
        provider === "google"
          ? new GoogleAuthProvider()
          : new FacebookAuthProvider();
      const result = await signInWithPopup(firebase_auth, authProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await fetch("/api/auth/handle-third-party-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate");
      }
      const data = await response.json();
      console.log("handleProviderLogin", data);
    } catch (error) {
      console.error("Third-party login error", error);
    } finally {
      provider === "google"
        ? setGoogleSubmitting(false)
        : setFacebookSubmitting(false);
    }
  };

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
        {message && <SuccessMessage>{message}</SuccessMessage>}
        {errors?.global && <ErrorMessage>{errors.global}</ErrorMessage>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "登入中..." : "登入"}
        </Button>
      </form>
      <Divider>
        <span>或</span>
      </Divider>
      <ButtonWrapper>
        <Button
          onClick={() => handleProviderLogin("google")}
          disabled={isGoogleSubmitting}
        >
          <FaGoogle /> Google
          {isGoogleSubmitting ? "登入中..." : "登入"}
        </Button>
      </ButtonWrapper>
      {/* <ButtonWrapper>
        <Button onClick={() => handleProviderLogin("facebook")}>
          <FaFacebook /> Facebook 登入
        {isFacebookSubmitting ? "登入中..." : "登入"}
        </Button>
      </ButtonWrapper> */}
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
