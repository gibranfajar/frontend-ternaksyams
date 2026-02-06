import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  setAuth,
  setAuthTokenOnly,
  logout,
  setUserAccountData,
  setUserAccountLoading,
  setUserAccountError,
  type AuthUser,
} from "../slices/authSlice";
import axios from "axios";
import { RootState } from "../store";

// --- 1. Thunk untuk Login Email/Password ---

export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        credentials,
        { headers: { "Content-Type": "application/json" } }
      );

      const { user, token, id } = response.data as {
        id: number;
        user: AuthUser;
        token: string;
      };

      if (!token || !user) {
        return rejectWithValue("Respon login tidak valid");
      }

      // Set token expiration (8 jam dari sekarang)
      const expirationTime = Date.now() + 8 * 60 * 60 * 1000;

      // Simpan ke Redux (Set data Auth dan User dasar)
      dispatch(setAuth({ id, token, user, expiresAt: expirationTime }));

      return { token, user };
    } catch (err: any) {
      console.error("Login error:", err?.response?.data || err?.message || err);
      return rejectWithValue(
        err?.response?.data?.message ||
          err?.response?.data ||
          "Gagal login, periksa email/password"
      );
    }
  }
);

// --- 2. Thunk untuk Google Login Callback (Hanya mendapatkan token) ---

export const googleTokenLogin = createAsyncThunk(
  "auth/googleTokenLogin",
  async (queryToken: string, { dispatch, rejectWithValue }) => {
    if (!queryToken) {
      return rejectWithValue("Token Google tidak ada atau kosong.");
    }
    try {
      // Hanya set token, user akan diisi oleh fetchUserData setelah ini
      dispatch(setAuthTokenOnly({ token: queryToken }));
      return { token: queryToken, user: null };
    } catch (err: any) {
      console.error("Error saat menyimpan token Google:", err?.message || err);
      return rejectWithValue("Gagal menyimpan token Google ke Redux.");
    }
  }
);

// --- 3. Thunk untuk Mengambil Data User Lengkap (Menggantikan accountThunk & userThunk) ---

export const fetchUserData = createAsyncThunk(
  "auth/fetchUserData",
  async (_, { dispatch, rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    const expiresAt = state.auth.expiresAt;

    dispatch(setUserAccountLoading()); // Mulai loading state

    if (!token) {
      dispatch(setUserAccountError("Token tidak ditemukan."));
      return rejectWithValue("Token tidak ditemukan di Redux state");
    }

    // Cek kedaluwarsa runtime
    if (expiresAt && Date.now() > Number(expiresAt)) {
      dispatch(logout());
      return rejectWithValue("Sesi kedaluwarsa. Silakan login kembali.");
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const user: AuthUser = response.data;

      // Menggunakan setUserAccountData untuk memperbarui data user
      dispatch(setUserAccountData(user));

      // Memperbarui state Auth (jika perlu) untuk memastikan konsistensi ID/ExpiresAt
      const id = user.id;
      const existingExpiresAt = state.auth.expiresAt;
      const expiresAtValue =
        existingExpiresAt || Date.now() + 8 * 60 * 60 * 1000;

      dispatch(setAuth({ id, token: token!, user, expiresAt: expiresAtValue }));

      return user;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal mengambil data user/akun";

      dispatch(setUserAccountError(msg));

      // Logout jika token dianggap tidak valid oleh server
      if (
        axios.isAxiosError(err) &&
        (err.response?.status === 401 || err.response?.status === 403)
      ) {
        dispatch(logout());
      }

      return rejectWithValue(msg);
    }
  }
);
