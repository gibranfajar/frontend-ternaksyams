// components/MobileBuyButton.tsx

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface MobileBuyButtonProps {
  // Anda bisa menambahkan props seperti URL produk, teks tombol, dll.
  productUrl: string;
}

const MobileBuyButton: React.FC<MobileBuyButtonProps> = ({ productUrl }) => {
  return (
    <div className="lg:hidden fixed bottom-0 right-0 p-3 z-50">
      <Link href={productUrl} passHref>
        <button
          className="
            btn 
            btn-primary 
            hover:bg-secondary 
            border-none 
            p-6 
            font-bold 
            rounded-full
            relative 
            transform 
            transition-all 
            duration-300
            glow-float-animation 
          "
        >
          <ShoppingCart className="w-6 h-6 mr-1" />{" "}
          {/* Tambahkan margin kanan */}
          Belanja
        </button>
      </Link>
    </div>
  );
};

export default MobileBuyButton;
