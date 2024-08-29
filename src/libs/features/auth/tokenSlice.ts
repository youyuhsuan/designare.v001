import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchToken,
  validateAndUpdateToken,
  deleteClientToken,
} from "@/src/libs/features/auth/tokenActions";
import { UserTokenData } from "@/src/type/token";

interface TokenState {
  token: UserTokenData | null;
  loading: boolean;
  error: string | null;
}

const initialState: TokenState = {
  token: null,
  loading: false,
  error: null,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchToken
      .addCase(fetchToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchToken.fulfilled,
        (state, action: PayloadAction<UserTokenData>) => {
          state.loading = false;
          state.token = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch token";
      })

      // validateAndUpdateToken
      .addCase(validateAndUpdateToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        validateAndUpdateToken.fulfilled,
        (state, action: PayloadAction<UserTokenData>) => {
          state.loading = false;
          state.token = action.payload;
          state.error = null;
        }
      )
      .addCase(validateAndUpdateToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to validate token";
      })

      // deleteClientToken
      .addCase(deleteClientToken.fulfilled, (state) => {
        state.token = null;
        state.error = null;
      })
      .addCase(deleteClientToken.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete token";
      });
  },
});

export const { clearError } = tokenSlice.actions;
export default tokenSlice.reducer;
