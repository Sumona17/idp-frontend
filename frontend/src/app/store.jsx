import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storageSession from "redux-persist/lib/storage/session";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import documentInventoryReducer from "../redux/document-inventory/documentInventorySlice";

import submissionReducer from "../redux/submissionSlice/submissionSlice";

const rootReducer = combineReducers({
  documentInventory: documentInventoryReducer,
  submission: submissionReducer,
});

const persistConfig = {
  key: "root",
  storage: storageSession,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
