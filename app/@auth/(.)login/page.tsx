"use client";

import { Modal } from "@/src/ui/modal";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/dist/client/link";
import styled from "styled-components";
import PasswordInput from "@/src/Components/PasswordInput";

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.2rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
`;

const RememberForgot = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ForgotPassword = styled(Link)`
  margin: 0 0 1.2rem auto;
  font-size: 12px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1rem 0;
  font-size: 0.6rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #ccc;
  }

  span {
    padding: 0 0.625rem;
  }
`;

const SocialLoginButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 1rem;
`;

export default function Page() {
  return (
    <Modal>
      <Title>歡迎回來！</Title>
      <Form>
        <InputGroup>
          <Label htmlFor="Email">電子郵件</Label>
          <input
            type="email"
            name="email"
            placeholder="請輸入您的電子郵件..."
            required
          />
        </InputGroup>
        <InputGroup>
          <PasswordInput />
        </InputGroup>
        <RememberForgot>
          <ForgotPassword href="/forgot-password">忘記密碼？</ForgotPassword>
        </RememberForgot>
        <button type="submit">登入</button>
      </Form>
      <Divider>
        <span>或</span>
      </Divider>
      <SocialLoginButton>
        <FaGoogle /> Google 登入
      </SocialLoginButton>
      <SocialLoginButton>
        <FaFacebook /> Facebook 登入
      </SocialLoginButton>
      <Footer>
        <span>
          還沒有帳號？ <Link href="/signup">立即註冊</Link>
        </span>
      </Footer>
    </Modal>
  );
}
