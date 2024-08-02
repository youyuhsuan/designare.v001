// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Modal } from "@/src/ui/Modal";
// import {
//   PasswordInput,
//   PasswordInputProps,
// } from "@/src/Components/PasswordInput";
// import Link from "next/link";
// import { FaGoogle, FaFacebook } from "react-icons/fa";
// import { Button } from "@/src/Components/Theme";
// import { useFormState } from "react-dom";

// export function AuthModal({
//   isOpen,
//   onClose,
//   initialMode = "login",
// }: AuthModalProps) {
//   const [mode, setMode] = useState(initialMode);
//   const [authFormState, formAction] = useFormState(authenticate, initialState);
//   const formRef = useRef<HTMLFormElement>(null);
//   const passwordRef = useRef<HTMLInputElement>(null);
//   const confirmPasswordRef = useRef<HTMLInputElement>(null);
//   const [passwordError, setPasswordError] = useState("");

//   useEffect(() => {
//     if (authFormState.message === "Signin successful") {
//       formRef.current?.reset();
//       if (passwordRef.current) passwordRef.current.value = "";
//       if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
//       setPasswordError("");
//     }
//   }, [authFormState]);

//   const renderContent = () => {
//     switch (mode) {
//       case "login":
//         return (
//           <>
//             <Title>歡迎回來！</Title>
//             <form ref={formRef} onSubmit={handleSubmit}>
//               <Wrapper>
//                 <Label htmlFor="Email">電子郵件</Label>
//                 <Input
//                   type="email"
//                   name="email"
//                   placeholder="請輸入您的電子郵件..."
//                   required
//                 />
//               </Wrapper>
//               <PasswordInput
//                 ref={passwordRef}
//                 label="密碼"
//                 id="password"
//                 placeholder="請輸入密碼..."
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <ForgotPasswordWrapper>
//                 <ForgotPassword
//                   href="#"
//                   onClick={() => setMode("forgot-password")}
//                 >
//                   忘記密碼？
//                 </ForgotPassword>
//               </ForgotPasswordWrapper>
//               <Button type="submit">登入</Button>
//             </form>
//             <Divider>
//               <span>或</span>
//             </Divider>
//             <Button>
//               <FaGoogle /> Google 登入
//             </Button>
//             <Button>
//               <FaFacebook /> Facebook 登入
//             </Button>
//             <Footer>
//               <span>
//                 還沒有帳號？
//                 <Link href="#" onClick={() => setMode("signup")}>
//                   立即註冊
//                 </Link>
//               </span>
//             </Footer>
//           </>
//         );
//       case "signup":
//         return (
//           <>
//             <Title>建立帳號</Title>
//             <form>
//               <Wrapper>
//                 <Label htmlFor="username">用戶名</Label>
//                 <Input
//                   id="username"
//                   type="text"
//                   name="username"
//                   placeholder="請輸入用戶名..."
//                   required
//                 />
//               </Wrapper>
//               <Wrapper>
//                 <Label htmlFor="Email">電子郵件</Label>
//                 <Input
//                   type="email"
//                   name="email"
//                   placeholder="請輸入電子郵件..."
//                   required
//                 />
//               </Wrapper>
//               <Wrapper>
//                 <PasswordInput
//                   ref={passwordRef}
//                   label="密碼"
//                   id="password"
//                   placeholder="請輸入密碼..."
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//               </Wrapper>
//               <Wrapper>
//                 <PasswordInput
//                   ref={confirmPasswordRef}
//                   label="確認密碼"
//                   id="confirmPassword"
//                   placeholder="請再次輸入密碼..."
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   error={passwordError}
//                 />
//               </Wrapper>
//               <Button type="submit">註冊</Button>
//             </form>
//             <Footer>
//               <span>
//                 已經有帳號了？{" "}
//                 <Link href="#" onClick={() => setMode("login")}>
//                   登入
//                 </Link>
//               </span>
//             </Footer>
//           </>
//         );
//       case "forgot-password":
//         return (
//           <>
//             <Title>重設密碼</Title>
//             <form>
//               <Wrapper>
//                 <Label htmlFor="Email">電子郵件</Label>
//                 <Input
//                   type="email"
//                   name="email"
//                   placeholder="請輸入您的電子郵件..."
//                   required
//                 />
//               </Wrapper>
//               <Button type="submit">發送重設密碼郵件</Button>
//             </form>
//             <Footer>
//               <span>
//                 想起密碼了？
//                 <Link href="#" onClick={() => setMode("login")}>
//                   返回登入
//                 </Link>
//               </span>
//             </Footer>
//           </>
//         );
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}>
//       {renderContent()}
//     </Modal>
//   );
// }
