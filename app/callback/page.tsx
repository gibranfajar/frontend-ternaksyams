// app/callback/page.tsx (Perbaikan)

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

import { googleTokenLogin } from "@/redux/thunks/authThunk";
// Pastikan path ke file authThunk Anda sudah benar

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      handleTokenLogin(token);
    } else {
      setError("Token Google Login tidak ditemukan di URL.");
      setLoading(false);
      toast.error("Gagal login: Token tidak ditemukan.");
      router.push("/login");
    }
  }, [searchParams, dispatch, router]);

  const handleTokenLogin = async (token: string) => {
    setLoading(true);
    try {
      // 🚀 Panggil thunk yang menjalankan dispatch(setAuthTokenOnly)
      await dispatch(googleTokenLogin(token)).unwrap();

      // 💡 Setelah token tersimpan, panggil fetchAccountData untuk melengkapi data user
      // import { fetchAccountData } from "@/redux/thunks/accountThunk";
      // await dispatch(fetchAccountData()).unwrap();
      // (Ini adalah langkah tambahan yang disarankan, tetapi tidak wajib untuk menyimpan token)

      setLoading(false);
      toast.success("Login Google berhasil!");
      router.push("/"); // Arahkan ke halaman utama
    } catch (err: any) {
      setLoading(false);
      const errorMessage =
        typeof err === "string"
          ? err
          : "Login gagal! Terjadi kesalahan saat memproses token Google.";
      setError(errorMessage);
      toast.error(errorMessage);
      router.push("/login");
    }
  };

  return (
    // ... (JSX dipertahankan)
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 font-inter">
      <div className="text-center p-8 bg-white rounded-lg shadow-xl">
        <Loader2 className="w-8 h-8 mx-auto mb-4 text-[#19996B] animate-spin" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          {loading ? "Memproses Login Google..." : "Pengalihan..."}
        </h2>
        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        {!loading && !error && (
          <p className="text-sm text-gray-500 mt-3">
            Sistem sedang mengarahkan Anda ke dashboard.
          </p>
        )}
      </div>
    </div>
  );
};

export default CallbackPage;
