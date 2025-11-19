import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { api } from "@/services/api";
import authReducer from "@/features/auth/authSlice";
import propertiesReducer from "@/features/properties/propertiesSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  properties: propertiesReducer,
  [api.reducerPath]: api.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

// These two lines are CRUCIAL
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
