import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
} from "react";
import { z } from "zod";

// 定義驗證模式
const loginSchema = z.object({
  email: z.string().email("無效的電子郵件地址"),
  password: z.string().min(6, "密碼至少需要6個字符"),
});

const signupSchema = loginSchema
  .extend({
    username: z.string().min(3, "用戶名至少需要3個字符"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不匹配",
    path: ["confirmPassword"],
  });

// 定義身份驗證狀態的類型
interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  error: string | null;
}

// 定義初始狀態
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
};

interface AuthContextType {
  formRef: React.RefObject<HTMLFormElement>;
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement>,
    action: "login" | "signup"
  ) => Promise<void>;
  authState: AuthState;
  setError: (errors: { [key: string]: string | null }) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const setError = useCallback((errors: { [key: string]: string | null }) => {
    setAuthState((prevState) => ({ ...prevState, errors }));
  }, []);

  const clearError = useCallback(() => {
    setAuthState((prevState) => ({ ...prevState, errors: null }));
  }, []);

  const handleSubmit = useCallback(
    async (
      event: React.FormEvent<HTMLFormElement>,
      action: "login" | "signup"
    ) => {
      event.preventDefault();
      clearError();
      console.log("Form submitted, action:", action);

      const formData = new FormData(event.currentTarget);

      const formObject = Object.fromEntries(formData.entries());
      console.log("Form data before validation:", formObject);

      try {
        // 根據 action 選擇驗證模式
        const schema = action === "login" ? loginSchema : signupSchema;

        const validatedData = schema.parse(formObject);
        console.log("Validated data:", validatedData); // 添加這行

        const result = schema.safeParse(formObject);
        if (result.success) {
          console.log("Validated data:", result.data);
        } else {
          console.error("Validation errors:", result.error.errors);
        }

        // 進行身份驗證
        const newState = await authenticate(validatedData, action);
        setAuthState(newState);
      } catch (error) {
        if (error instanceof z.ZodError) {
          // Zod 驗證錯誤
          // console.error(
          //   "Detailed ZodError:",
          //   JSON.stringify(error.errors, null, 2)
          // );
          // console.log(typeof error.errors);
          const errors = error.issues.reduce((acc, issue) => {
            const path = issue.path[0] as string;
            acc[path] = issue.message;
            return acc;
          }, {} as { [key: string]: string | null });
          console.log(errors);
          setError(errors);
        } else {
          setError({
            global: error instanceof Error ? error.message : "發生未知錯誤",
          });
        }
      }
    },
    [clearError, setError]
  );

  return (
    <AuthContext.Provider
      value={{ formRef, handleSubmit, authState, setError, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthForm = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthForm must be used within an AuthProvider");
  }
  return context;
};

const authenticate = async (
  data: z.infer<typeof loginSchema> | z.infer<typeof signupSchema>,
  action: "login" | "signup"
): Promise<AuthState> => {
  // 這裡應該是實際的身份驗證邏輯，可能涉及API調用
  if (
    action === "login" &&
    data.email === "test@example.com" &&
    data.password === "password"
  ) {
    return { isAuthenticated: true, user: data.email, error: null };
  } else if (action === "signup") {
    // 模擬註冊成功
    return { isAuthenticated: true, user: data.email, error: null };
  } else {
    throw new Error("無效的電子郵件或密碼");
  }
};
