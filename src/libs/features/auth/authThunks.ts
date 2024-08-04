import { AppThunk } from "@/src/libs/store";
import {
  setAuthState,
  setError,
  clearError,
  setMessage,
  clearMessage,
} from "./authSlice";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
} from "@/src/libs/schemas/auth";
// import { authenticate, resetPassword } from "@/app/api/auth/auth";
import { z } from "zod";

const callApi = async (url: string, data: any) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "API call failed");
  }
  return response.json();
};

export const handleSubmit =
  (
    formData: FormData,
    action: "login" | "signup" | "forgot-password"
  ): AppThunk =>
  // 異步function thunk
  async (dispatch) => {
    dispatch(clearError());
    dispatch(clearMessage());
    const formObject = Object.fromEntries(formData.entries());
    //  formObject = {
    //    key: value,
    //  };
    //
    //  Key username, email...
    //  Value ...

    try {
      let schema;
      let validatedData;
      let result;

      switch (action) {
        case "login":
          schema = loginSchema;
          validatedData = schema.parse(formObject);
          //  解析 formData 是否符合 schema 中定義的規範
          result = await callApi("/api/auth/login", validatedData);
          // result = await authenticate(validatedData, "login");
          dispatch(setAuthState(result));
          break;
        case "signup":
          schema = signupSchema;
          validatedData = schema.parse(formObject);
          result = await callApi("/api/auth/signup", validatedData);
          // result = await authenticate(validatedData, "signup");
          dispatch(setAuthState(result));
          break;
        case "forgot-password":
          schema = forgotPasswordSchema;
          validatedData = schema.parse(formObject);
          result = await callApi("/api/auth/forgot-password", validatedData);
          // result = await resetPassword(validatedData.email);
          dispatch(setMessage("密碼重置郵件已發送"));
          break;
        default:
          throw new Error("Invalid action");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        //  檢查的對象object instanceof 構造函數或類別Constructor

        //  [
        //    {
        //      code: "invalid_type",
        //      expected: "string",
        //      received: "number",
        //      path: ["names", 1],
        //      message: "Invalid input: expected string, received number"
        //    }
        //  ]
        // 使用 reduce 來將數組轉換為對象
        const errors = error.issues.reduce((acc, issue) => {
          const path = issue.path[0] as string;
          acc[path] = issue.message;
          return acc;
        }, {} as { [key: string]: string });

        //  空對象 {}
        //  類型斷言 as { [key: string]: string }
        dispatch(setError(errors));
      } else {
        dispatch(
          setError({
            global: error instanceof Error ? error.message : "發生未知錯誤",
          })
        );
      }
    }
  };
