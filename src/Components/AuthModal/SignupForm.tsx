// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import { AuthMode } from "@/src/Components/AuthModal/AuthModal";
// import { useAuthForm } from "@/src/Components/AuthModal/AuthContext";
// import {
//   Title,
//   Input,
//   Wrapper,
//   Label,
//   Footer,
//   ErrorMessage,
// } from "@/src/Components/AuthModal/AuthModal.styles";
// import { PasswordInput } from "@/src/Components/AuthModal/PasswordInput";
// import { Button } from "@/src/Components/Theme";
// import Link from "next/link";

// interface SignupFormProps {
//   onModeChange: (mode: AuthMode) => void;
// }

// export const SignupForm: React.FC<SignupFormProps> = ({ onModeChange }) => {
//   const {
//     formRef,
//     handleSubmit: authHandleSubmit,
//     authState,
//     clearError,
//     setError,
//   } = useAuthForm();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [passwordValues, setPasswordValues] = useState({
//     password: "",
//     confirmPassword: "",
//   });

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setPasswordValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name } = e.target;
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     clearError();
//     try {
//       await authHandleSubmit(e, "signup");
//     } catch (error) {
//       // 錯誤已經在 authHandleSubmit 中處理，這裡不需要再設置
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//   return (
//     <>
//       <Title>建立帳號</Title>
//       <form ref={formRef} onSubmit={handleSubmit}>
//         <Wrapper>
//           <Label htmlFor="username">用戶名</Label>
//           <Input
//             id="username"
//             name="username"
//             type="text"
//             placeholder="請輸入用戶名..."
//             onChange={handleInputChange}
//             required
//           />
//           {authState.errors?.username && (
//             <ErrorMessage>{authState.errors.username}</ErrorMessage>
//           )}
//         </Wrapper>
//         <Wrapper>
//           <Label htmlFor="email">電子郵件</Label>
//           <Input
//             id="email"
//             name="email"
//             type="email"
//             placeholder="請輸入電子郵件..."
//             onChange={handleInputChange}
//             required
//           />
//           {authState.errors?.email && (
//             <ErrorMessage>{authState.errors.email}</ErrorMessage>
//           )}
//         </Wrapper>
//         <PasswordInput
//           label="密碼"
//           id="password"
//           name="password"
//           placeholder="請輸入密碼..."
//           value={passwordValues.password}
//           onChange={handlePasswordChange}
//           error={authState.errors?.password}
//         />
//         <PasswordInput
//           label="確認密碼"
//           id="confirmPassword"
//           name="confirmPassword"
//           placeholder="請再次輸入密碼..."
//           value={passwordValues.confirmPassword}
//           onChange={handlePasswordChange}
//           error={authState.errors?.confirmPassword}
//         />
//         {authState.errors?.global && (
//           <ErrorMessage>{authState.errors.global}</ErrorMessage>
//         )}
//         <Button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? "註冊中..." : "註冊"}
//         </Button>
//       </form>
//       <Footer>
//         <span>
//           已經有帳號了？
//           <Link
//             href="#"
//             onClick={(e) => {
//               e.preventDefault();
//               onModeChange("login");
//             }}
//           >
//             登入
//           </Link>
//         </span>
//       </Footer>
//     </>
//   );
// };
