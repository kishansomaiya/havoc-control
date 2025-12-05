import { configureStore } from "@reduxjs/toolkit";
import { havocApi } from "./store/havocAPI";
import mapSlice from "./store/features/mapSlice";
import appSlice from "./store/features/appSlice";

export const store = configureStore({
  reducer: {
    [havocApi.reducerPath]: havocApi.reducer,
    map: mapSlice,
    app: appSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(havocApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
