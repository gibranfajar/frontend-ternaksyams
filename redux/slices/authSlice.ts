// src/redux/slices/authSlice.ts (VERSI BARU GABUNGAN)

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 💡 Definisikan interface AuthUser yang PALING LENGKAP
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  whatsapp: string;
  address?: string | null;
  province?: string | null;
  city?: string | null;
  district?: string | null;
  postalCode?: string | null;
  email_verified_at?: string | null;
  google_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  // Data Otentikasi (dari authSlice lama)
  id: number | null;
  token: string | null;
  isAuthenticated: boolean;
  expiresAt: number | null;

  // Data Pengguna Lengkap (dari authSlice lama + accountSlice lama)
  user: AuthUser | null;

  // State Pemuatan/Error untuk operasi mengambil data akun (dari accountSlice lama)
  isUserLoading: boolean; // Ganti nama agar lebih spesifik
  userError: string | null; // Ganti nama agar lebih spesifik
}

const initialState: AuthState = {
  id: null,
  token: null,
  user: null,
  isAuthenticated: false,
  expiresAt: null,
  isUserLoading: false,
  userError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer Otentikasi (Sama seperti authSlice lama)
    setAuth: (
      state,
      action: PayloadAction<{
        id: number;
        token: string;
        user: AuthUser;
        expiresAt: number;
      }>
    ) => {
      state.id = action.payload.id;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.expiresAt = action.payload.expiresAt;
    },

    setAuthTokenOnly: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
      state.expiresAt = Date.now() + 8 * 60 * 60 * 1000;
      state.user = null; // Penting: Tetap kosongkan user jika hanya token
      state.id = null;
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.expiresAt = null;
      state.isUserLoading = false; // Reset state loading
      state.userError = null; // Reset state error
    },

    // Reducer Data Akun (Dipindahkan dari accountSlice)
    setUserAccountData: (state, action: PayloadAction<AuthUser>) => {
      // 💡 Perbarui user dengan data yang lebih lengkap dari API /user
      state.user = { ...state.user, ...action.payload } as AuthUser;
      state.isUserLoading = false;
      state.userError = null;
    },

    setUserAccountLoading: (state) => {
      state.isUserLoading = true;
      state.userError = null;
    },

    setUserAccountError: (state, action: PayloadAction<string>) => {
      state.userError = action.payload;
      state.isUserLoading = false;
    },
  },
});

export const {
  setAuth,
  setAuthTokenOnly,
  logout,
  setUserAccountData,
  setUserAccountLoading,
  setUserAccountError,
} = authSlice.actions;

export default authSlice.reducer;

// 🚨 Catatan: Hapus accountSlice.ts yang lama setelah ini.
