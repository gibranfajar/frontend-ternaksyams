"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
  loginHref?: string; // default: /login?redirect=/checkout
  registerHref?: string; // default: /register?redirect=/checkout
}

const AuthPromptModal: React.FC<Props> = ({
  open,
  onClose,
  onContinueAsGuest,
  loginHref = "/login?redirect=/checkout",
  registerHref = "/register?redirect=/checkout",
}) => {
  const router = useRouter();
  if (!open) return null;

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/50"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-[92%] max-w-[560px] rounded-xl bg-white p-6 md:p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[28px] md:text-[32px] leading-tight font-semibold text-[#0E5A45] mb-4">
          Hai, Kamu Belum Masuk Akun
        </h2>
        <p className="text-[15px] md:text-[16px] text-gray-600 leading-relaxed mb-6">
          Masuk akun untuk menikmati pengalaman personal dan mengakses semua
          layanan kami.
        </p>

        <button
          onClick={() => go(loginHref)}
          className="w-full h-12 md:h-14 rounded-md bg-[#0E5A45] text-white text-[16px] md:text-[18px] font-semibold transition-colors hover:bg-[#0c4d3b] mb-2"
        >
          Masuk akun
        </button>

        <p className="text-center text-[13px] text-gray-600 mt-2 mb-3">
          Belum punya akun ?
        </p>

        <button
          onClick={() => go(registerHref)}
          className="w-full h-12 md:h-14 rounded-md border border-[#0E5A45] text-[#0E5A45] text-[16px] md:text-[18px] font-semibold mb-3 hover:bg-green-50"
        >
          Daftarkan diri
        </button>

        <button
          onClick={onContinueAsGuest}
          className="w-full h-12 md:h-14 rounded-md border border-[#0E5A45] text-[#0E5A45] text-[16px] md:text-[18px] font-semibold hover:bg-green-50"
        >
          Lanjut sebagai tamu
        </button>

        <div className="mt-6 rounded-md bg-[#FAFAF2] px-4 py-4 text-center">
          <p className="text-[12.5px] text-gray-700">
            "Dengan melanjutkan sebagai tamu, Anda tidak akan dapat melihat
            riwayat pesanan atau mendapatkan keuntungan akun."
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPromptModal;
