"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import LogoTs from "../public/images/logo_ternaksyams.png";
import DrawerCart from "./DrawerCart";
import { useRouter } from "next/navigation";
import {
  CircleX,
  ShoppingBag,
  CircleUserRound,
  ShoppingCart,
  ChevronDown, // Import ikon untuk dropdown
} from "lucide-react";

// Redux hooks & state
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";

// Tentukan API URL dari environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BRANDS_API_ENDPOINT = `${API_URL}/brands`;

// ==========================================================
// 1. STRUKTUR MENU BARU (DENGAN CHILD/SUBMENU)
// ==========================================================
interface MenuItem {
  href: string;
  label: string;
  children?: MenuItem[]; // Properti opsional untuk submenu
}

// Interface untuk data Brand dari API
interface Brand {
  id: number;
  brand: string;
  slug: string;
}

// Struktur menu utama (children untuk 'Brand Kami' akan diisi dari API)
const baseMenuItems: MenuItem[] = [
  { href: "/", label: "Beranda" },
  {
    href: "/brand-kami",
    label: "Brand Kami",
    children: [
      { href: "/brand-kami", label: "Semua Brand" },
      // Brand dari API akan disisipkan di sini
    ],
  },
  { href: "/reseller", label: "Reseller" },
  { href: "/afiliator", label: "Afiliator" },
  { href: "/tentang-kami", label: "Tentang Kami" },
];

// Durasi animasi (sesuaikan dengan duration-300 di DrawerCart.tsx)
const ANIMATION_DURATION = 300;

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [emailLS, setEmailLS] = useState<string | null>(null);
  const [nameLS, setNameLS] = useState<string | null>(null);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  // Tambahan state untuk mengontrol submenu di sidebar mobile
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // State baru untuk menyimpan data brand dari API
  const [brandData, setBrandData] = useState<Brand[]>([]);

  const auth = useAppSelector((s) => s.auth);
  const cartItems = useAppSelector((s) => s.cart.cartItems);

  const isAuthenticated = auth.isAuthenticated;
  const userEmail = (auth.user as any)?.email ?? emailLS ?? null;
  const userName = (auth.user as any)?.name ?? nameLS ?? null;

  // ==========================================================
  // 4. LOGIKA FETCH DATA BRAND
  // ==========================================================
  useEffect(() => {
    // Ambil data brand dari localStorage/Redux jika ada, atau fetch dari API
    const fetchBrands = async () => {
      try {
        const res = await fetch(BRANDS_API_ENDPOINT);
        if (!res.ok) {
          throw new Error("Gagal mengambil data brands");
        }
        const data = await res.json();
        // Hanya ambil 'brand' dan 'slug'
        const brands: Brand[] = data.data.map((item: any) => ({
          id: item.id,
          brand: item.brand,
          slug: item.slug,
        }));
        setBrandData(brands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();

    // Ambil data dari localStorage untuk user info
    try {
      const e = localStorage.getItem("email");
      if (e) setEmailLS(e);
      const n = localStorage.getItem("name");
      if (n) setNameLS(n);
    } catch {}
  }, []);

  // ==========================================================
  // 5. MEMBANGUN STRUKTUR MENU DINAMIS
  // ==========================================================
  const menuItems = useMemo(() => {
    // Buat salinan menuItems dasar
    const dynamicMenuItems = JSON.parse(JSON.stringify(baseMenuItems));

    // Temukan index dari menu "Brand Kami"
    const brandIndex = dynamicMenuItems.findIndex(
      (item: MenuItem) => item.label === "Brand Kami"
    );

    if (brandIndex !== -1) {
      // Petakan data brand ke dalam format MenuItem[]
      const brandChildren: MenuItem[] = brandData.map((brand) => ({
        href: `/brand-kami/${brand.slug}`,
        label: brand.brand,
      }));

      // Sisipkan brand baru setelah "Semua Brand" (index 0)
      dynamicMenuItems[brandIndex].children?.splice(1, 0, ...brandChildren);
    }
    return dynamicMenuItems;
  }, [brandData]); // Re-calculate saat brandData berubah

  // Logika cartItemCount, drawer, sidebar, logout (Tidak ada perubahan signifikan)
  const cartItemCount = useMemo(
    () =>
      cartItems.reduce(
        (acc: number, item: any) => acc + (item.quantity ?? 0),
        0
      ),
    [cartItems]
  );

  const openDrawerHandler = () => {
    setDrawerVisible(true);
    setTimeout(() => setOpenDrawer(true), 10);
  };

  const closeDrawerHandler = () => {
    setOpenDrawer(false);
    setTimeout(() => setDrawerVisible(false), ANIMATION_DURATION);
  };

  const toggleSidebar = () => {
    setOpenSidebar((prev) => !prev);
    // Tutup submenu saat sidebar ditutup/dibuka secara keseluruhan
    if (openSidebar) setOpenSubmenu(null);
  };
  const closeSidebar = () => {
    setOpenSidebar(false);
    setOpenSubmenu(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
    } catch {}
    router.push("/");
    closeSidebar();
  };

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
    router.push("/account");
  };

  // ==========================================================
  // 2. RENDER MENU DESKTOP DENGAN DROPDOWN (Tidak ada perubahan)
  // ==========================================================
  const renderDesktopMenu = (items: MenuItem[]) => {
    return items.map((item) => {
      if (item.children) {
        // Menu dengan submenu (Dropdown DaisyUI)
        return (
          <li key={item.href} tabIndex={0}>
            {/* Menggunakan tag <div> agar bisa jadi induk dropdown */}
            <details>
              <summary className="font-bold text-primary hover:text-secondary focus:text-secondary">
                {item.label}
              </summary>
              <ul className="p-2 bg-base-100 rounded-box w-52 shadow-lg z-1">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <a
                      href={child.href}
                      className="text-primary hover:bg-gray-100"
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        );
      } else {
        // Menu tanpa submenu (Link biasa)
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className="font-bold text-primary hover:text-secondary focus:text-secondary"
            >
              {item.label}
            </Link>
          </li>
        );
      }
    });
  };

  // ==========================================================
  // 3. RENDER MENU MOBILE DENGAN TOGGLE SUBMENU (Tidak ada perubahan)
  // ==========================================================
  const toggleMobileSubmenu = (href: string) => {
    setOpenSubmenu(openSubmenu === href ? null : href);
  };

  const renderMobileMenu = (items: MenuItem[]) => {
    return items.map((item) => {
      if (item.children) {
        const isOpen = openSubmenu === item.href;
        // Menu dengan submenu
        return (
          <li key={`mobile-${item.href}`}>
            {/* Gunakan tombol/div untuk toggle submenu */}
            <button
              onClick={() => toggleMobileSubmenu(item.href)}
              className="flex justify-between items-center w-full"
            >
              {item.label}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            {/* Submenu (Render kondisional berdasarkan state) */}
            {isOpen && (
              <ul className="pl-4 border-l border-gray-200 ml-4">
                {item.children.map((child) => (
                  <li key={`mobile-sub-${child.href}`}>
                    <Link href={child.href} onClick={closeSidebar}>
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        );
      } else {
        // Menu tanpa submenu (Link biasa)
        return (
          <li key={`mobile-${item.href}`}>
            <Link href={item.href} onClick={closeSidebar}>
              {item.label}
            </Link>
          </li>
        );
      }
    });
  };

  return (
    <div className="drawer bg-white">
      <input
        id="my-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={openSidebar}
        onChange={toggleSidebar}
      />
      <div className="drawer-content">
        <div className="navbar container mx-auto px-3 md:px-5 lg:px-10 py-4">
          {/* START */}
          <div className="navbar-start">
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
            <ul className="menu menu-horizontal px-1 gap-4">
              {renderDesktopMenu(menuItems)}{" "}
              {/* ⬅️ Menggunakan fungsi render baru */}
              <li className="text-accent font-bold">
                <Link href="/flash-sale">Flash Sale</Link>
              </li>
            </ul>
          </div>

          {/* END */}
          <div className="navbar-end gap-2">
            <Link href="/shop" className="hidden lg:block">
              <button className="btn btn-primary hover:bg-secondary border-none px-8 py-6 font-bold rounded-full">
                <ShoppingCart />
                Belanja
              </button>
            </Link>

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
                        className="flex justify-center w-full py-3 px-4 rounded-xl border-2 border-[#114838] text-[#114838] font-semibold transition duration-300 ease-in-out hover:bg-[#114838]/10"
                      >
                        Daftar
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={openDrawerHandler}
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

            <div>
              {drawerVisible && (
                <DrawerCart onClose={closeDrawerHandler} isOpen={openDrawer} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Content (drawer-side) */}
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
          onClick={closeSidebar}
        ></label>

        <div className="p-4 w-80 min-h-full bg-base-100 text-base-content font-bold">
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

          {/* Menu Navigasi di Sidebar (menggunakan renderMobileMenu) */}
          <ul className="menu">
            {renderMobileMenu(menuItems)}{" "}
            {/* ⬅️ Menggunakan fungsi render baru */}
            <li className="text-accent">
              <Link href="/flash-sale" onClick={closeSidebar}>
                Flash Sale
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                className="btn btn-primary hover:bg-secondary border-none px-8 py-6 font-bold rounded-full"
                onClick={closeSidebar}
              >
                Belanja Sekarang
              </Link>
            </li>
          </ul>

          <div className="divider my-2"></div>

          {/* Menu Otentikasi (Tidak ada perubahan) */}
          <ul className="menu">
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
