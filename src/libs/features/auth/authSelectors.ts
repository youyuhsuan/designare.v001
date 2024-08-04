import { RootState } from "@/src/libs/store";

export const selectAuthErrors = (state: RootState) => state.auth.errors;

//  selectAuthErrors
//  選擇Redux store 的狀態中選擇和提取認證相關的錯誤訊息

//  state
//  所有Redux store 狀態

//  state.auth.errors
//  state 中提取auth slice 的errors 屬性

export const selectAuthMessage = (state: RootState) => state.auth.message;
