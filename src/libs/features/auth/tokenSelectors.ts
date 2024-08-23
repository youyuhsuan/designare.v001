import { RootState } from "@/src/libs/store";

export const selectToken = (state: RootState) => state.token.token;
export const selectTokenLoading = (state: RootState) => state.token.loading;
export const selectTokenError = (state: RootState) => state.token.error;
