"use client";

import React, { useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
// Dependensi UI yang Identik
import {
  UserPlus,
  Mail,
  Lock,
  Phone,
  Loader2,
  AlertCircle,
  CheckCircle,
  LogInIcon,
} from "lucide-react";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // State error untuk menampilkan pesan error di atas form
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalType, setModalType] = useState<"success" | "error" | "">("");
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDASI FORM DI SINI (Membuat form merah jika kosong/tidak valid)
    if (!name || !email || !whatsapp || !password) {
      setError("Semua kolom harus diisi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email tidak valid.");
      return;
    }

    const whatsappRegex = /^[0-9]{10,13}$/;
    if (!whatsappRegex.test(whatsapp)) {
      setError("Nomor WhatsApp tidak valid (hanya angka, 10-13 digit).");
      return;
    }

    // Clear error dan mulai loading jika validasi berhasil
    setError("");
    setIsLoading(true);

    // MENGGUNAKAN URL DARI .ENV
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/register`;

    const registerData = {
      name: name,
      email: email,
      nowhatsapp: whatsapp,
      password: password,
    };

    try {
      const response = await axios.post(apiUrl, registerData);

      if (response.data.message === "User created successfully") {
        setModalMessage("Pendaftaran berhasil! Silakan masuk ke akun Anda.");
        setModalType("success");
        modalRef.current?.showModal();
        setName("");
        setEmail("");
        setWhatsapp("");
        setPassword("");
      }
    } catch (error: any) {
      let message = "Pendaftaran gagal. Silakan coba lagi.";
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;
        if (errorMessage === "The email has already been taken.") {
          message = "Email sudah digunakan. Silakan coba dengan email lain.";
        }
      }
      setModalMessage(message);
      setModalType("error");
      modalRef.current?.showModal();
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  // Class untuk styling input yang error (sesuai permintaan, box menjadi merah)
  const errorInputClass =
    "border-red-500 focus:ring-red-500 focus:border-red-500";
  // Class untuk styling input yang normal/fokus (diambil dari Login)
  const normalInputClass =
    "border-gray-300 focus:ring-[#23B97F] focus:border-[#23B97F]";

  // Class untuk styling error message di atas form (diambil dari Login)
  const errorContainerClass =
    "bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-5 transition duration-300 shadow-sm";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 font-inter">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all duration-300">
        {/* Kolom Form Register (Kiri) */}
        <div className="w-full md:w-3/5 p-8 sm:p-12 order-2 md:order-1">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center">
              <UserPlus className="w-8 h-8 mr-3 text-primary" /> Buat Akun
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Daftar sekarang untuk membuka fitur eksklusif, menyimpan progres
              Anda, dan menjadi bagian dari komunitas kami.
            </p>

            <form onSubmit={handleSubmit}>
              {/* PESAN ERROR DI SINI (Identik dengan Login) */}
              {error && <div className={errorContainerClass}>{error}</div>}

              {/* Input Name */}
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <UserPlus className="w-4 h-4 mr-2 text-primary" /> Nama
                  Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition duration-150 shadow-sm ${
                    error && !name ? errorInputClass : normalInputClass
                  }`}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Input Email */}
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-primary" /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh@domain.com"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition duration-150 shadow-sm ${
                    error && !email ? errorInputClass : normalInputClass
                  }`}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Input Whatsapp */}
              <div className="mb-5">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-primary" /> No. WhatsApp
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition duration-150 shadow-sm ${
                    error && !whatsapp ? errorInputClass : normalInputClass
                  }`}
                  disabled={isLoading}
                  required
                  pattern="[0-9]{10,13}"
                  title="Nomor WhatsApp (10-13 digit angka)"
                />
              </div>

              {/* Input Password */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-primary" /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition duration-150 shadow-sm ${
                    error && !password ? errorInputClass : normalInputClass
                  }`}
                  disabled={isLoading}
                  required
                  minLength={4}
                />
              </div>

              {/* Area Lupa Password & Link Login */}
              <div className="flex justify-between items-center mb-6">
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-primary hover:text-[#12714D] transition duration-150"
                >
                  Lupa password?
                </Link>
                <div>
                  <span className="text-sm text-gray-600">
                    Sudah punya akun?
                  </span>
                  <Link
                    href="/login"
                    className="text-sm font-semibold text-primary hover:text-[#12714D] ml-1"
                  >
                    Masuk Akun
                  </Link>
                </div>
              </div>

              {/* Button Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold text-lg rounded-xl hover:bg-[#12714D] transition duration-300 shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                    Memproses...
                  </>
                ) : (
                  "Daftar Sekarang"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Kolom Info/Promosi (Kanan) */}
        <div className="w-full md:w-2/5 bg-primary text-white p-8 sm:p-12 flex flex-col justify-center items-center text-center order-1 md:order-2">
          <LogInIcon className="w-12 h-12 mb-4" />
          <h3 className="text-3xl font-bold mb-3">Selamat Datang!</h3>
          <p className="text-sm font-light mb-8 opacity-90">
            Masuk untuk menikmati pengalaman personal dan mengakses semua
            layanan kami.
          </p>
          <Link
            href="/login"
            className="w-full py-3 px-6 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition duration-300 shadow-md hover:shadow-lg text-lg"
          >
            Masuk Akun
          </Link>
        </div>
      </div>

      {/* Modal HTML Dialog (Pertahankan) */}
      <dialog
        id="register_modal"
        className="modal"
        ref={modalRef}
        style={{ zIndex: 100 }}
      >
        <div className="modal-box flex flex-col items-center justify-center p-10 space-y-4 max-w-sm w-full shadow-2xl rounded-2xl">
          <button
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-800 transition"
            onClick={closeModal}
          >
            ✕
          </button>

          {modalType === "success" && (
            <>
              <CheckCircle className="w-16 h-16 text-[#23B97F]" />
              <h3 className="font-bold text-2xl text-gray-800 mt-2">
                Pendaftaran Sukses
              </h3>
              <p className="text-center text-gray-600 text-sm">
                {modalMessage}
              </p>
              <button
                className="w-full py-3 mt-4 font-bold text-white rounded-xl bg-primary hover:bg-[#12714D] transition"
                onClick={() => {
                  closeModal();
                  window.location.href = "/login";
                }}
              >
                Login Sekarang
              </button>
            </>
          )}

          {modalType === "error" && (
            <>
              <AlertCircle className="w-16 h-16 text-red-500" />
              <h3 className="font-bold text-xl text-gray-800 mt-2">
                Pendaftaran Gagal
              </h3>
              <p className="text-center text-gray-600 text-sm">
                {modalMessage}
              </p>
              <button
                className="w-full py-3 mt-4 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition"
                onClick={closeModal}
              >
                Tutup
              </button>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Register;
