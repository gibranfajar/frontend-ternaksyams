import React from "react";
import varian from "../public/images/varian.png";
import Image from "next/image";

// 1. DEFINISI TIPE DATA UNTUK ITEM WHY US
interface WhyUsItem {
  id: number;
  text: string;
}

// 2. DEFINISI TIPE DATA UNTUK KESELURUHAN DUMMY
interface DummyData {
  whyUs: WhyUsItem[]; // Array dari WhyUsItem
}

// Data Dummy tetap disatukan di sini, sekarang dengan tipe eksplisit
export const dummy: DummyData = {
  whyUs: [
    {
      id: 1,
      text: "Menggunakan bahan alami dengan proses yang ramah lingkungan.",
    },
    {
      id: 2,
      text: "Produk bebas bahan kimia sehingga hasil yang didapat alami dan murni.",
    },
    { id: 3, text: "Produk Ternak Syams tidak ada berbau prengus (kambing)." },
    {
      id: 4,
      text: "Susu Etawa kami kaya vitamin dan nutrisi yang mudah diserap.",
    },
    {
      id: 5,
      text: "Semua produk dapat dikonsumsi mulai dari anak minimal 2 tahun.",
    },
    { id: 6, text: "Semua produk sudah tersertifikasi BPOM." },
  ],
};

// 3. DEFINISI TIPE DATA UNTUK PROPS KOMPONEN FEATURE
interface WhyUsFeatureProps {
  text: string;
}

// Mendefinisikan komponen WhyUsFeature dengan Props bertipe WhyUsFeatureProps
const WhyUsFeature: React.FC<WhyUsFeatureProps> = ({ text }) => {
  return (
    <li className="flex items-start space-x-3">
      {/* Icon centang */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-base text-gray-700">{text}</p>
    </li>
  );
};

export default function HookTop() {
  const data = dummy;

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row">
        <Image src={varian} alt="logo" width={500} height={500}></Image>
        <div>
          <h2 className="text-3xl font-bold text-primary">
            Kenapa Ternak Syams ?
          </h2>
          <p className="py-6">
            Kami menggunakan bahan alami dengan proses yang ramah untuk tubuh.
            Produk kami memberikan manfaat secara natural tanpa bahan kimia,
            sehingga hasil yang didapat alami dan nyata, tanpa kekambuhan, dan
            aman tanpa efek samping
          </p>
          <h3 className="text-2xl font-bold text-primary mb-5">
            Keunggulan Susu Etawa Ternak Syam
          </h3>

          <ul className="space-y-3">
            {/* Pemanggilan data yang sudah diketik dengan benar */}
            {data.whyUs.map((feature) => (
              <WhyUsFeature key={feature.id} text={feature.text} />
            ))}
          </ul>

          <button className="btn btn-primary hover:bg-secondary border-none px-8 py-6 my-8 font-bold text-base rounded-full">
            Selengkapnya
          </button>
        </div>
      </div>
    </div>
  );
}
