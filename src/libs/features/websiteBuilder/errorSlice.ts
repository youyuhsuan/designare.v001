import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const errorSlice = createSlice({
  name: "error",
  initialState: { message: null as string | null },
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    clearError: (state) => {
      state.message = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;

export default errorSlice.reducer;
