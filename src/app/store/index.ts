import { configureStore } from "@reduxjs/toolkit";
import category from "./categories";
import book from "./books";

export const store = configureStore({
  reducer: {
    category,
    book,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
