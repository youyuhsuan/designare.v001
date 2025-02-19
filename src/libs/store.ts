import { combineSlices, configureStore } from "@reduxjs/toolkit";
import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { counterSlice } from "./features/counter/counterSlice";
import { quotesApiSlice } from "./features/quotes/quotesApiSlice";

import { tokenSlice } from "./features/auth/tokenSlice";
import { authSlice } from "./features/auth/authSlice";

import { analyticsMiddleware } from "./features/middleware/analyticsMiddleware";

import { errorSlice } from "@/src/libs/features/websiteBuilder/errorSlice";
import { elementLibrarySlice } from "./features/websiteBuilder/elementLibrarySlice";
import { globalSettingsSlice } from "./features/websiteBuilder/globalSettingsSlice";
import { websiteMetadataSlice } from "./features/websiteBuilder/websiteMetadataSlice";
import { userPreferencesSlice } from "./features/websiteBuilder/userPreferencesSlice";
import { historySlice } from "./features/websiteBuilder/historySlice";

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineSlices(
  counterSlice,
  quotesApiSlice,
  authSlice,
  tokenSlice,
  elementLibrarySlice,
  errorSlice,
  globalSettingsSlice,
  websiteMetadataSlice,
  userPreferencesSlice,
  historySlice
);
// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

// `makeStore` encapsulates the store configuration to allow
// creating unique store instances, which is particularly important for
// server-side rendering (SSR) scenarios. In SSR, separate store instances
// are needed for each request to prevent cross-request state pollution.
export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(
        quotesApiSlice.middleware,
        analyticsMiddleware
      );
    },
  });
};

// Infer the return type of `makeStore`
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
