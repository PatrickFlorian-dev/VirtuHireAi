import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
