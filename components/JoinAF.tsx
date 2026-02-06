import goat from "@/public/images/goat.png";
import Link from "next/link";

export default function JoinAF() {
  return (
    <div className="absolute -top-48 w-full mx-auto max-w-[1200px] inset-0">
      <div className="relative  mt-6 md:mt-2 rounded-2xl overflow-hidden">
        {/* Background image */}
        <img
          src={goat.src}
          alt="goat background"
          className="h-[360px] w-full object-cover"
        />
        {/* Overlay hijau gelap */}
        <div className="absolute inset-0 bg-[#133F33]/75" />

        {/* Konten */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-6 md:px-10 text-center text-white max-w-[900px]">
            <h3 className="font-extrabold leading-tight text-[30px] md:text-[40px]">
              Ingin menjadi mitra afiliator kami?
            </h3>
            <p className="mt-4 text-white/85 leading-relaxed">
              Ternak Syams menyediakan peluang bisnis yang menguntungkan dengan
              produk-produk yang telah terbukti laku di pasaran, memberikan
              potensi keuntungan besar bagi para mitra bisnis
            </p>

            <div className="mt-8">
              <Link href="/afiliator">
                <button className="inline-flex items-center justify-center rounded-full border border-white/90 px-6 py-3 text-white font-semibold hover:bg-white/10 transition">
                  Join Sekarang!
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bayangan lembut agar terlihat “terangkat” */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
      </div>
    </div>
  );
}
