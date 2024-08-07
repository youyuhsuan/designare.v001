import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  // 表示用戶是否已認證
  user: string | null;
  //  當前認證的用戶
  errors: { [key: string]: string | null } | null;
  message: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  errors: null,
  message: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<Partial<AuthState>>) => {
      return { ...state, ...action.payload };
    },
    //  Partial<T> T 生成所有可選屬性
    //  部分更新 AuthState 的属性
    setError: (
      state,
      action: PayloadAction<{ [key: string]: string | null }>
    ) => {
      state.errors = action.payload;
    },
    clearError: (state) => {
      state.errors = null;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
});

export const { setAuthState, setError, clearError, setMessage, clearMessage } =
  authSlice.actions;
export default authSlice.reducer;
