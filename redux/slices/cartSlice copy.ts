import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Tipe untuk data item di keranjang
interface CartItem {
  productName: string;
  flavourId: number;
  flavourName: string | null;
  sizeId: string;
  sizeName: string | null;
  price: number;
  discount: number;
  price_discount: number;
  imageId: string | number;
  imageUrl: string;
  quantity: number;
  total: number;
}

interface CartState {
  cartItems: CartItem[];
  session?: string | null; // session bisa null atau string
  cartId?: number | null;
}

const initialState: CartState = {
  cartItems: [],
  session: null,
  cartId: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action: PayloadAction<CartItem>) {
      const existingItem = state.cartItems.find(
        (item) =>
          item.sizeId === action.payload.sizeId &&
          item.flavourName === action.payload.flavourName &&
          item.sizeName === action.payload.sizeName
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        const unit =
          (Number.isFinite(existingItem.price_discount)
            ? existingItem.price_discount
            : existingItem.price) ?? 0; // Pastikan tidak undefined
        existingItem.total = existingItem.quantity * unit;
      } else {
        const unit =
          (Number.isFinite(action.payload.price_discount)
            ? action.payload.price_discount
            : action.payload.price) ?? 0; // Pastikan tidak undefined

        state.cartItems.push({
          ...action.payload,
          total: unit * action.payload.quantity,
        });
      }
    },

    removeItemFromCart(state, action: PayloadAction<string>) {
      state.cartItems = state.cartItems.filter(
        (item) => item.sizeId !== action.payload
      );
    },

    updateItemQuantity(
      state,
      action: PayloadAction<{ sizeId: string; quantity: number }>
    ) {
      const item = state.cartItems.find(
        (item) => item.sizeId === action.payload.sizeId
      );
      if (item) {
        item.quantity = action.payload.quantity;
        const unit =
          (Number.isFinite(item.price_discount)
            ? item.price_discount
            : item.price) ?? 0; // Pastikan tidak undefined
        item.total = item.quantity * unit;
      }
    },

    setCartMeta(
      state,
      action: PayloadAction<{ session?: string | null; cartId?: number | null }>
    ) {
      // Menyimpan metadata seperti session dan cartId
      state.session = action.payload.session ?? null;
      state.cartId = action.payload.cartId ?? null;
    },

    clearCartMeta(state) {
      // Menghapus metadata session dan cartId
      state.session = null;
      state.cartId = null;
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  setCartMeta,
  clearCartMeta,
} = cartSlice.actions;

export default cartSlice.reducer;
