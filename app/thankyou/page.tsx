"use client";

import sheepThanks from "@/public/images/ilustration/sheep-thanks.png";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const ThankYouPage: React.FC = () => {
  const searchParams = useSearchParams();

  // Ambil nilai dari searchParams URL
  const invoiceNumber = searchParams.get("invoice") || "INV-TS/XXXXXX/XXXX";
  const userEmail = searchParams.get("email") || "email tidak tersedia";

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      <div className="relative z-10 w-full max-w-lg bg-white p-8 md:p-10 rounded-xl shadow-2xl border border-gray-100 transform transition-all hover:shadow-3xl">
        {/* Konten Anda yang lain */}
        <div className="flex flex-col items-center mb-4">
          <img src={sheepThanks.src} alt="Thank You" className="w-1/2" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-green-800 text-center mb-3">
          Pesananmu Berhasil!
        </h2>
        <p className="text-md text-center text-gray-700 mb-8 max-w-sm mx-auto">
          Terima kasih telah berbelanja di TernakSyams.
        </p>
        <div className="bg-green-50 p-5 rounded-lg mb-8 border-l-4 border-green-400">
          <div className="items-center">
            <div className="text-center mb-4">
              <p className="text-sm font-medium text-green-700">
                Nomor Pesanan
              </p>
              <p className="text-2xl text-green-900 font-bold tracking-wider">
                {invoiceNumber}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">
                Bukti transaksi telah dikirim ke email:
              </p>
              <p className="text-lg text-gray-800 font-semibold mt-1">
                {userEmail}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-10 gap-2 sm:gap-4 flex-col sm:flex-row">
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-green-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-green-700 transition duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          >
            Lanjut Belanja
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto bg-green-600 text-white font-semibold py-3 px-10 rounded-full shadow-lg hover:bg-green-700 transition duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          >
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
