import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await axios.get(`${apiUrl}/categories`);
      //   console.log("Data Categories:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error); // Menangani jika ada error
      throw error; // Melempar error agar bisa ditangani oleh `rejected` case di slice
    }
  }
);
