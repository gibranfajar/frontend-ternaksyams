"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import LogoTs from "../public/images/logo_ternaksyams.png";
import DrawerCart from "./DrawerCart";
import { useRouter, usePathname } from "next/navigation";
import {
  CircleX,
  ShoppingBag,
  CircleUserRound,
  ShoppingCart,
  ChevronDown,
  Menu,
  Zap, // Ikon untuk Flash Sale
} from "lucide-react";

// Redux hooks & state
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const BRANDS_API_ENDPOINT = `${API_URL}/brands`;

// ==========================================================
// INTERFACES
// ==========================================================
interface MenuItem {
  href: string;
  label: string;
  children?: MenuItem[];
}

interface Brand {
  id: number;
  brand: string;
  slug: string;
}

const baseMenuItems: MenuItem[] = [
  { href: "/", label: "Beranda" },
  {
    href: "/brand-kami",
    label: "Brand Kami",
    children: [{ href: "/brand-kami", label: "Semua Brand" }],
  },
  { href: "/reseller", label: "Reseller" },
  { href: "/afiliator", label: "Afiliator" },
  { href: "/tentang-kami", label: "Tentang Kami" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  // State Management
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [brandData, setBrandData] = useState<Brand[]>([]);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // Redux States
  const auth = useAppSelector((s) => s.auth);
  const cartItems = useAppSelector((s) => s.cart.cartItems);

  const isAuthenticated = auth.isAuthenticated;
  const userName = (auth.user as any)?.name ?? null;

  // Fetch Brand Data
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch(BRANDS_API_ENDPOINT);
        if (!res.ok) throw new Error("Gagal mengambil data brands");
        const data = await res.json();
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
  }, []);

  // Handle click outside for auth menu
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAuthMenu(false);
      }
    }
    if (showAuthMenu) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showAuthMenu]);

  // Dynamic Menu Structure
  const menuItems = useMemo(() => {
    const dynamicMenuItems: MenuItem[] = JSON.parse(
      JSON.stringify(baseMenuItems)
    );
    const brandIndex = dynamicMenuItems.findIndex(
      (item: MenuItem) => item.label === "Brand Kami"
    );

    if (brandIndex !== -1 && brandData.length > 0) {
      const brandChildren: MenuItem[] = brandData.map((brand) => ({
        href: `/brand-kami/${brand.slug}`,
        label: brand.brand,
      }));
      dynamicMenuItems[brandIndex].children?.push(...brandChildren);
    }
    return dynamicMenuItems;
  }, [brandData]);

  const cartItemCount = useMemo(
    () =>
      cartItems.reduce(
        (acc: number, item: any) => acc + (item.quantity ?? 0),
        0
      ),
    [cartItems]
  );

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    router.push("/");
    setOpenSidebar(false);
  };

  // ==========================================================
  // RENDER HELPERS
  // ==========================================================

  const renderDesktopMenu = (items: MenuItem[]) => {
    return items.map((item: MenuItem) => {
      const isActive = pathname === item.href;

      if (item.children) {
        return (
          <li
            key={item.href}
            className="relative group"
            onMouseEnter={() => setHoveredMenu(item.label)}
            onMouseLeave={() => setHoveredMenu(null)}
          >
            <button
              className={`flex items-center gap-1 font-semibold transition-colors duration-200 py-2 ${
                isActive ? "text-primary" : "text-gray-700 hover:text-primary"
              }`}
            >
              {item.label}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  hoveredMenu === item.label ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute left-0 top-full pt-2 transition-all duration-300 ${
                hoveredMenu === item.label
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <ul className="bg-white shadow-xl rounded-xl border border-gray-100 p-2 min-w-[200px] z-110">
                {item.children.map((child: MenuItem) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      }

      return (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`font-semibold transition-colors duration-200 py-2 ${
              isActive ? "text-primary" : "text-gray-700 hover:text-primary"
            }`}
          >
            {item.label}
          </Link>
        </li>
      );
    });
  };

  return (
    <nav className="bg-white sticky top-0 z-100 border-b border-gray-50">
      <div className="navbar container mx-auto px-4 lg:px-10 py-3">
        {/* START SECTION */}
        <div className="navbar-start">
          <button
            onClick={() => setOpenSidebar(true)}
            className="btn btn-ghost lg:hidden p-2 min-h-0 h-auto mr-2"
            aria-label="Open Menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <Link href="/" className="transition-transform hover:scale-105">
            <Image
              src={LogoTs}
              alt="logo"
              width={160}
              height={40}
              priority
              className="w-auto h-8 md:h-10"
            />
          </Link>
        </div>

        {/* CENTER SECTION (Desktop Only) */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-8 text-[15px]">
            {renderDesktopMenu(menuItems)}
            <li>
              <Link
                href="/flash-sale"
                className="font-bold text-orange-500 hover:text-orange-600 px-3 py-1 bg-orange-50 rounded-full transition-colors"
              >
                ⚡ Flash Sale
              </Link>
            </li>
          </ul>
        </div>

        {/* END SECTION */}
        <div className="navbar-end gap-3">
          {/* Flash Sale - Mobile Badge (Visible on Small Screens) */}
          <Link
            href="/flash-sale"
            className="lg:hidden flex items-center bg-orange-100 px-3 py-1.5 rounded-full animate-pulse border border-orange-200"
          >
            <Zap className="w-3.5 h-3.5 text-orange-600 fill-orange-600 mr-1" />
            <span className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">
              Sale
            </span>
          </Link>

          <Link href="/shop" className="hidden sm:flex">
            <button className="btn btn-primary btn-md rounded-full px-6 normal-case font-bold shadow-md hover:shadow-lg transition-all border-none">
              <ShoppingCart className="w-5 h-5" />
              Belanja
            </button>
          </Link>

          <div className="flex items-center gap-1 border-l pl-3 ml-1 border-gray-100">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() =>
                  isAuthenticated
                    ? router.push("/account")
                    : setShowAuthMenu(!showAuthMenu)
                }
                className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600"
              >
                <CircleUserRound strokeWidth={1.5} size={26} />
              </button>

              {!isAuthenticated && showAuthMenu && (
                <div className="absolute right-0 mt-3 w-56 p-4 bg-white shadow-2xl rounded-2xl border border-gray-100 z-120 animate-in fade-in zoom-in duration-200">
                  <Link
                    href="/login"
                    onClick={() => setShowAuthMenu(false)}
                    className="btn btn-primary btn-block mb-2 rounded-xl normal-case"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setShowAuthMenu(false)}
                    className="btn btn-outline btn-primary btn-block rounded-xl normal-case"
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setDrawerVisible(true);
                setTimeout(() => setOpenDrawer(true), 10);
              }}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors relative text-gray-600"
            >
              <ShoppingBag strokeWidth={1.5} size={26} />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-0 z-150 transition-all ${
          openSidebar ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            openSidebar ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpenSidebar(false)}
        />
        <div
          className={`absolute left-0 top-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out p-6 ${
            openSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-8">
            <Image src={LogoTs} alt="logo" width={120} height={30} />
            <button
              onClick={() => setOpenSidebar(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <CircleX className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <ul className="space-y-4">
            {menuItems.map((item: MenuItem) => (
              <li key={item.href}>
                {item.children ? (
                  <div>
                    <button
                      onClick={() =>
                        setOpenSubmenu(
                          openSubmenu === item.label ? null : item.label
                        )
                      }
                      className="flex justify-between items-center w-full font-bold text-gray-800 py-2"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openSubmenu === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        openSubmenu === item.label
                          ? "max-h-96 mt-2 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="pl-4 space-y-3 border-l-2 border-gray-100 ml-1">
                        {item.children.map((child: MenuItem) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setOpenSidebar(false)}
                              className="text-gray-600 text-sm block py-1"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setOpenSidebar(false)}
                    className="block font-bold text-gray-800 py-2"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}

            {/* Flash Sale on Sidebar (Mobile) */}
            <li>
              <Link
                href="/flash-sale"
                onClick={() => setOpenSidebar(false)}
                className="flex items-center font-bold text-orange-500 py-2"
              >
                <Zap className="w-4 h-4 mr-2 fill-orange-500" />
                Flash Sale
              </Link>
            </li>
          </ul>

          <div className="mt-10 pt-6 border-t border-gray-100">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-red-500 font-bold flex items-center gap-2 w-full text-left p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                Keluar ({userName})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  className="btn btn-primary btn-sm rounded-lg normal-case shadow-none"
                  onClick={() => setOpenSidebar(false)}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="btn btn-outline btn-primary btn-sm rounded-lg normal-case"
                  onClick={() => setOpenSidebar(false)}
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CART DRAWER */}
      {drawerVisible && (
        <DrawerCart
          onClose={() => {
            setOpenDrawer(false);
            setTimeout(() => setDrawerVisible(false), 300);
          }}
          isOpen={openDrawer}
        />
      )}
    </nav>
  );
}
