import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

// `buildCreateSlice` 允許我們使用 async thunks 來創建 slice
export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator },
});
