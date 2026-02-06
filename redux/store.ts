import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import categoriesReducer from "./slices/categoriesSlice";
import authReducer, { logout } from "./slices/authSlice"; // <-- Gunakan authSlice yang baru

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const cartPersistConfig = { key: "cart", storage };
const authPersistConfig = {
  key: "auth",
  storage,
  // Tetap whitelist properti yang perlu disimpan, properti loading/error akan hilang saat rehidrasi
  whitelist: ["id", "token", "user", "isAuthenticated", "expiresAt"],
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Logika middleware untuk cek kedaluwarsa saat aplikasi dimuat ulang
const expirationMiddleware =
  (storeAPI: any) => (next: any) => (action: any) => {
    if (action.type === "persist/REHYDRATE") {
      try {
        const state = storeAPI.getState();
        const exp = state?.auth?.expiresAt;
        if (exp && Date.now() > Number(exp)) {
          storeAPI.dispatch(logout());
        }
      } catch {}
    }

    return next(action);
  };

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: persistedCartReducer,
    categories: categoriesReducer,
    // 💡 HANYA ADA SATU REDUCER UNTUK AUTH/USER
    auth: persistedAuthReducer,
    // 🚨 Hapus account: accountReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(expirationMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 🚨 Catatan Akhir: Pastikan Anda MENGHAPUS file accountSlice.ts, accountThunk.ts, dan userThunk.ts yang lama.
