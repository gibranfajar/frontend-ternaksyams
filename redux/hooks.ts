// Custom hooks untuk Redux (useAppDispatch, useAppSelector)

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

// Custom hook untuk menggunakan dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Custom hook untuk memilih state dari Redux store
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
