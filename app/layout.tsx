"use client";

import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import Navbar
import Footer from "@/components/Footer"; // Import Footer
import { Provider } from "react-redux";
import { store, persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <title>Ternak Syams</title>
        <meta
          name="description"
          content="Ternak Syams menciptakan produk susu kambing dengan kandungan gizi yang tinggi, rendah gula, dan bermanfaat bagi pemulihan asma juga radang sendi. Dengan rasa yang enak tanpa aroma prengus, agar semua dapat turut mengkonsumsi."
        />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:type" content="website" />
      </head>
      <body className={`${manrope.variable} antialiased`}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ToastContainer />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </PersistGate>
        </Provider>

        <Script
          src={process.env.NEXT_PUBLIC_MIDTRANS_URL}
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
