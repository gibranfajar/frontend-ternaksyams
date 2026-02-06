import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_PRODUCT_URL;

    try {
      const response = await axios.get(`${apiUrl}`);
      // console.log("Data Produk:", response.data);
      return response.data; // Mengembalikan data produk yang akan digunakan oleh slice
    } catch (error) {
      console.error("Error fetching products:", error); // Menangani jika ada error
      throw error; // Melempar error agar bisa ditangani oleh `rejected` case di slice
    }
  }
);
