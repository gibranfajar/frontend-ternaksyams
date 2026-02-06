import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { setCartMeta } from "../slices/cartSlice";

type AddToCartBody = {
  product_id: number;
  user_id: string | number | null; // Perbaikan tipe: bisa string, number, atau null
  qty: number;
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    payload: { body: AddToCartBody[]; asGuest: boolean }, // Perubahan: body menjadi array
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.auth?.token || null;

      const url = `${process.env.NEXT_PUBLIC_API_URL}/cart/add`;

      const headers =
        !payload.asGuest && token
          ? {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            }
          : { "Content-Type": "application/json" };

      const res = await axios.post(url, { items: payload.body }, { headers }); // Kirim array dalam field items

      const data = res?.data ?? {};
      const session =
        data?.session ??
        data?.checkout_session ??
        data?.data?.session ??
        data?.data?.checkout_session ??
        "";
      const cartId = data?.cart_id ?? data?.data?.cart_id ?? null;

      // Menyimpan metadata session dan cartId
      if (session || cartId) {
        dispatch(setCartMeta({ session: session || "", cartId }));
      }

      return {
        success: !!data?.success,
        session,
        cart_id: cartId,
        message: data?.message || "",
        raw: data,
      };
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal menambahkan ke keranjang";
      return rejectWithValue(msg);
    }
  }
);
