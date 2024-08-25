import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export const historySlice = createSlice({
  name: "history",
  initialState: {
    past: [] as any[],
    present: null as any,
    future: [] as any[],
  },
  reducers: {
    undo: (state) => {
      if (state.past.length > 0) {
        const newPresent = state.past[state.past.length - 1];
        state.future = [state.present, ...state.future];
        state.present = newPresent;
        state.past = state.past.slice(0, -1);
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const newPresent = state.future[0];
        state.past = [...state.past, state.present];
        state.present = newPresent;
        state.future = state.future.slice(1);
      }
    },
    addToHistory: (state, action: PayloadAction<any>) => {
      state.past = [...state.past, state.present];
      state.present = action.payload;
      state.future = [];
    },
  },
});

export const { undo, redo, addToHistory } = historySlice.actions;

export default historySlice.reducer;
