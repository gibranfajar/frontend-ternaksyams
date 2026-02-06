"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import LogoTs from "../public/images/logo_ternaksyams.png";
import DrawerCart from "./DrawerCart"; // Import DrawerCart yang sudah diupdate
import { useRouter } from "next/navigation";
import {
  CircleX,
  ShoppingBag,
  CircleUserRound,
  ShoppingCart,
} from "lucide-react";

// Redux hooks & state
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";

// Definisikan daftar menu untuk menghindari pengulangan
const menuItems = [
  { href: "/", label: "Beranda" },
  { href: "/brand-kami", label: "Brand Kami" },
  { href: "/reseller", label: "Reseller" },
  { href: "/afiliator", label: "Afiliator" },
  { href: "/tentang-kami", label: "Tentang Kami" },
];

// Durasi animasi (sesuaikan dengan duration-300 di DrawerCart.tsx)
const ANIMATION_DURATION = 300;

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [openDrawer, setOpenDrawer] = useState(false); // State untuk animasi slide (true = translate-x-0)
  const [drawerVisible, setDrawerVisible] = useState(false); // State untuk mengontrol keberadaan di DOM
  const [openSidebar, setOpenSidebar] = useState(false); // untuk menu sidebar mobile
  const [emailLS, setEmailLS] = useState<string | null>(null);
  const [nameLS, setNameLS] = useState<string | null>(null);
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  const auth = useAppSelector((s) => s.auth);
  const cartItems = useAppSelector((s) => s.cart.cartItems);

  const isAuthenticated = auth.isAuthenticated;
  const userEmail = (auth.user as any)?.email ?? emailLS ?? null;
  const userName = (auth.user as any)?.name ?? nameLS ?? null;

  useEffect(() => {
    // fallback untuk render awal
    try {
      const e = localStorage.getItem("email");
      if (e) setEmailLS(e);
      const n = localStorage.getItem("name");
      if (n) setNameLS(n);
    } catch {}
  }, []);

  const cartItemCount = useMemo(
    () =>
      cartItems.reduce(
        (acc: number, item: any) => acc + (item.quantity ?? 0),
        0
      ),
    [cartItems]
  );

  // 1. Handler baru untuk membuka drawer (Slide-in)
  const openDrawerHandler = () => {
    setDrawerVisible(true); // Pasang komponen ke DOM
    // Beri jeda kecil agar DOM selesai update sebelum mulai animasi
    setTimeout(() => setOpenDrawer(true), 10);
  };

  // 2. Handler baru untuk menutup drawer (Slide-out)
  const closeDrawerHandler = () => {
    setOpenDrawer(false); // Mulai animasi slide-out
    // Setelah animasi selesai (300ms), hapus dari DOM
    setTimeout(() => setDrawerVisible(false), ANIMATION_DURATION);
  };

  // Tambahan: handler untuk toggle sidebar
  const toggleSidebar = () => setOpenSidebar((prev) => !prev);
  const closeSidebar = () => setOpenSidebar(false);

  // hanya dipakai di /account, tapi taruh di sini juga bila perlu quick-logout
  const handleLogout = () => {
    dispatch(logout());
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
    } catch {}
    router.push("/");
    closeSidebar(); // Tutup sidebar setelah logout
  };

  // 1. Ref untuk menu auth (sudah ada)
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAuthMenu(false);
      }
    }
    if (showAuthMenu) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showAuthMenu]);

  const onAccountClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuthMenu((v) => !v);
      return;
    }
    // sudah login → ke /account
    router.push("/account");
  };

  // ==========================================================
  // LOGIKA LAMA (KLIK DI LUAR DRAWER) DIHAPUS
  // ==========================================================
  // Logika useRef dan useEffect yang lama telah dihapus karena sekarang ditangani oleh overlay di DrawerCart.tsx

  return (
    // Menggunakan DaisyUI Drawer untuk Sidebar Mobile
    <div className="drawer bg-white">
      {/* Checkbox untuk mengontrol visibility sidebar */}
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={openSidebar}
        onChange={toggleSidebar}
      />
      {/* Navbar di dalam drawer-content */}
      <div className="drawer-content">
        <div className="navbar container mx-auto px-3 md:px-5 lg:px-10 py-4">
          {/* START */}
          <div className="navbar-start">
            {/* Tombol Sidebar (Hanya terlihat di mobile) */}
            <label
              htmlFor="my-drawer"
              className="btn btn-ghost lg:hidden"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <Link href="/" className="text-xl">
              <Image
                src={LogoTs}
                alt="logo"
                width={200}
                height={200}
                priority
              />
            </Link>
          </div>

          {/* CENTER (desktop) */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 font-bold text-primary gap-4">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li className="text-accent">
                <Link href="/flash-sale" onClick={closeSidebar}>
                  Flash Sale
                </Link>{" "}
                {/* Asumsi Flash Sale belum punya halaman, pakai '#' */}
              </li>
            </ul>
          </div>

          {/* END */}
          <div className="navbar-end gap-2">
            {/* Tombol Belanja Sekarang */}
            <Link href="/shop" className="hidden lg:block">
              <button className="btn btn-primary hover:bg-secondary border-none px-8 py-6 font-bold rounded-full">
                <ShoppingCart />
                Belanja
              </button>
            </Link>

            {/* Tombol akun: behavior kondisional */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={onAccountClick}
                className="cursor-pointer relative p-2 rounded-md flex items-center"
                aria-haspopup={!isAuthenticated ? "menu" : undefined}
                aria-expanded={!isAuthenticated ? showAuthMenu : undefined}
                aria-controls={!isAuthenticated ? "auth-menu" : undefined}
                title={isAuthenticated ? "Akun" : "Login / Daftar"}
              >
                <CircleUserRound strokeWidth={1.25} size={24} />
              </button>

              {/* Auth menu (hanya muncul kalau belum login) */}
              {!isAuthenticated && showAuthMenu && (
                <div
                  id="auth-menu"
                  role="menu"
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg z-50"
                >
                  <div className="menu menu-sm p-4 w-52 rounded-2xl bg-white shadow-xl">
                    <div role="none" className="mb-2">
                      <Link
                        role="menuitem"
                        href="/login"
                        onClick={() => setShowAuthMenu(false)}
                        // Styling Tombol "Masuk" (Latar Belakang Hijau, Teks Putih, Sudut Melengkung Penuh)
                        className="flex justify-center w-full py-3 px-4 rounded-xl bg-[#114838] text-white font-semibold transition duration-300 ease-in-out hover:bg-opacity-90"
                      >
                        Masuk
                      </Link>
                    </div>
                    <div role="none">
                      <Link
                        role="menuitem"
                        href="/register"
                        onClick={() => setShowAuthMenu(false)}
                        // Styling Tombol "Daftar" (Border Hijau, Teks Hijau, Sudut Melengkung Penuh)
                        className="flex justify-center w-full py-3 px-4 rounded-xl border-2 border-[#114838] text-[#114838] font-semibold transition duration-300 ease-in-out hover:bg-[#114838]/10"
                      >
                        Daftar
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Keranjang */}
            <button
              onClick={openDrawerHandler} // ⬅️ Menggunakan handler baru
              className="cursor-pointer relative p-2 rounded-md flex items-center"
              title="Keranjang"
              id="cart-button"
            >
              <ShoppingBag strokeWidth={1.25} size={24} />
              {cartItemCount > 0 && (
                <div className="badge badge-primary badge-sm indicator-item">
                  {cartItemCount}
                </div>
              )}
            </button>

            {/* Wrapper untuk DrawerCart */}
            <div>
              {/* ⬅️ Hanya render komponen jika drawerVisible true */}
              {drawerVisible && (
                <DrawerCart onClose={closeDrawerHandler} isOpen={openDrawer} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Content (drawer-side) - Tetap Sama */}
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={closeSidebar}
        ></label>

        {/* Konten Sidebar: Header dan Menu Navigasi */}
        <div className="p-4 w-80 min-h-full bg-base-100 text-base-content font-bold">
          {/* Header Sidebar: Logo dan Tombol Close (TIDAK di dalam <li>) */}
          <div className="flex justify-between items-center mb-4">
            <Link href="/" onClick={closeSidebar}>
              <Image
                src={LogoTs}
                alt="logo"
                width={150}
                height={150}
                priority
              />
            </Link>
            <button
              className="btn btn-ghost btn-circle"
              onClick={closeSidebar}
              aria-label="Close menu"
            >
              <CircleX strokeWidth={1.25} size={24} />
            </button>
          </div>

          <div className="divider my-0"></div>

          {/* Menu Navigasi di Sidebar (di dalam <ul>) */}
          <ul className="menu">
            {menuItems.map((item) => (
              <li key={`mobile-${item.href}`}>
                <Link href={item.href} onClick={closeSidebar}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="text-accent">
              <Link href="/flash-sale" onClick={closeSidebar}>
                Flash Sale
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="btn btn-primary hover:bg-secondary border-none px-8 py-6 font-bold rounded-full"
              >
                Belanja Sekarang
              </Link>
            </li>
          </ul>

          <div className="divider my-2"></div>

          {/* Menu Otentikasi */}
          <ul className="menu">
            {/* Jika belum login, tampilkan Login/Daftar di sidebar */}
            {!isAuthenticated && (
              <>
                <li>
                  <Link href="/login" onClick={closeSidebar}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" onClick={closeSidebar}>
                    Daftar
                  </Link>
                </li>
              </>
            )}
            {/* Jika sudah login, tampilkan tombol Logout di sidebar */}
            {isAuthenticated && (
              <li>
                <button
                  onClick={handleLogout}
                  className="text-error hover:bg-error hover:text-base-100"
                >
                  Logout ({userName})
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
