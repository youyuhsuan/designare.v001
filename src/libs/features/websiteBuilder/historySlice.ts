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
        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, state.past.length - 1);
        return {
          past: newPast,
          present: previous,
          future: [state.present, ...state.future],
        };
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future[0];
        const newFuture = state.future.slice(1);
        return {
          past: [...state.past, state.present],
          present: next,
          future: newFuture,
        };
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
