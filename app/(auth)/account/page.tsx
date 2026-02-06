"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "@/redux/thunks/authThunk";
import { RootState } from "@/redux/store";
import { logout, AuthUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

// 💡 Asumsi komponen-komponen ini sudah ada
import VoucherList from "@/components/VoucherList";
import OrderHistory from "@/components/OrderHistory";
// --- IMPORT KOMPONEN BARU ---
import PromoInfo from "@/components/PromoInfo";

// --- TIPE DATA ---
type ActiveTab = "order" | "promo" | "voucher" | "profile";

// --- KOMPONEN BANTUAN ---

/**
 * @description Komponen TabButton untuk layout Desktop (Sidebar)
 */
const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full text-left text-lg md:text-xl transition-colors select-none",
        "py-5 px-4 md:px-6 border-b border-gray-300",
        isActive
          ? "bg-[#0E5A45] text-white rounded-r-lg font-semibold"
          : "text-gray-900 hover:bg-gray-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
};

/**
 * @description Komponen form untuk menampilkan dan mengedit Profile
 */
function ProfileForm({ user }: { user: AuthUser }) {
  return (
    <div>
      <h2 className="text-2xl md:text-[28px] font-bold text-gray-900">
        Profil Akun
      </h2>
      {/* <span className="block mt-2 text-sm text-gray-500">
        User ID (Testing) : **{user.id}**
      </span> */}
      <form className="mt-6 md:mt-8">
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          <Input placeholder="Email" value={user.email} />
          <Input placeholder="Nama" value={user.name} />
          <Input placeholder="Whatsapp" value={user.whatsapp} />
          <Input placeholder="Address" value={user.address} />
          <Input placeholder="Province" value={user.province} />
          <Input placeholder="City" value={user.city} />
          <Input placeholder="District" value={user.district} />
          <Input placeholder="Postal Code" value={user.postalCode} />
        </div>

        <div className="mt-8 md:mt-10">
          <button
            type="button"
            className="mx-auto block w-full sm:w-[300px] rounded-md bg-[#155E49] px-6 py-3 text-white font-semibold hover:opacity-95"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * @description Komponen Input readOnly untuk Profile Form
 */
function Input({
  placeholder,
  value,
}: {
  placeholder: string;
  value: string | null | undefined;
}) {
  return (
    <input
      type="text"
      value={value ?? ""}
      readOnly
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#155E49]"
    />
  );
}

/**
 * @description Komponen Placeholder untuk konten yang belum diimplementasikan
 * (Tidak lagi digunakan untuk "Promo Info")
 */
function Placeholder({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-2xl md:text-[28px] font-bold text-gray-900">
        {title}
      </h2>
      <p className="mt-2 text-gray-500">{subtitle}</p>
    </div>
  );
}

// --- KOMPONEN UTAMA ---

export default function AccountPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user, isUserLoading, userError } = useSelector(
    (state: RootState) => state.auth
  );

  const [active, setActive] = useState<ActiveTab>("profile");

  useEffect(() => {
    dispatch(fetchUserData() as any);
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("session");

    dispatch(logout());
    router.push("/login");
  };

  // 1. STATE MANAGEMENT UI: Loading
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ Memuat Data Akun...
      </div>
    );
  }

  // 2. STATE MANAGEMENT UI: Error
  if (userError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        ❌ Error: {userError}
      </div>
    );
  }

  // 3. STATE MANAGEMENT UI: Not Logged In
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Silakan login untuk mengakses halaman ini.
      </div>
    );
  }

  // Konten utama berdasarkan tab aktif
  const renderTabContent = (currentActive: ActiveTab) => {
    switch (currentActive) {
      case "profile":
        return <ProfileForm user={user} />;
      case "order":
        return <OrderHistory />;
      case "voucher":
        return <VoucherList />;
      case "promo":
        // Menggunakan komponen PromoInfo yang baru
        return <PromoInfo />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-10 py-10 md:py-14">
        {/* ========================================================= */}
        {/* 1. LAYOUT DESKTOP (SIDEBAR) - md:flex */}
        {/* ========================================================= */}
        <div className="hidden md:flex items-stretch gap-8 md:gap-10">
          {/* LEFT: Sidebar Navigation */}
          <aside className="w-[320px] md:w-[360px] lg:w-[400px] shrink-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-extrabold text-[#155E49]">
              Hi, {user.name}
            </h1>
            <p className="mt-3 text-gray-500">
              Manage your account setting and personal information.
            </p>

            {/* Tab Buttons */}
            <div className="mt-6 md:mt-8">
              <TabButton
                label="Profile"
                isActive={active === "profile"}
                onClick={() => setActive("profile")}
              />
              <TabButton
                label="Order History"
                isActive={active === "order"}
                onClick={() => setActive("order")}
              />
              <TabButton
                label="Voucher"
                isActive={active === "voucher"}
                onClick={() => setActive("voucher")}
              />
              <TabButton
                label="Promo Info"
                isActive={active === "promo"}
                onClick={() => setActive("promo")}
              />
            </div>

            {/* Logout Button */}
            <div className="pt-6 md:pt-8">
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-3 rounded-lg border-2 border-[#155E49] px-5 py-3 text-[#155E49] font-medium hover:bg-[#155E49]/5"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path d="M9 5l-7 7 7 7" />
                    <path d="M2 12h20" />
                  </svg>
                </span>
                Log Out
              </button>
            </div>
          </aside>

          {/* Vertical Divider */}
          <div className="w-px bg-gray-300" />

          {/* RIGHT: Tab Content */}
          <main className="flex-1">{renderTabContent(active)}</main>
        </div>

        {/* ========================================================= */}
        {/* 2. LAYOUT MOBILE (DAISYUI TABS LIFT + RADIO) - md:hidden */}
        {/* ========================================================= */}
        <div className="md:hidden">
          <h1 className="text-3xl font-extrabold text-[#155E49]">
            Hi, {user.name}
          </h1>
          <p className="mt-2 mb-6 text-gray-500 text-sm">
            Kelola pengaturan dan informasi pribadi Anda.
          </p>

          {/* DAISYUI TABS LIFT CONTAINER */}
          <div role="tablist" className="tabs tabs-lift">
            {/* Tab: Profile */}
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label="Profile"
              checked={active === "profile"}
              onChange={() => setActive("profile")}
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 border p-4"
            >
              {active === "profile" && renderTabContent("profile")}
            </div>

            {/* Tab: Order History */}
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label="Orders"
              checked={active === "order"}
              onChange={() => setActive("order")}
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 border p-4"
            >
              {active === "order" && renderTabContent("order")}
            </div>

            {/* Tab: Voucher */}
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label="Voucher"
              checked={active === "voucher"}
              onChange={() => setActive("voucher")}
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 border p-4"
            >
              {active === "voucher" && renderTabContent("voucher")}
            </div>

            {/* Tab: Promo Info */}
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              className="tab"
              aria-label="Promo"
              checked={active === "promo"}
              onChange={() => setActive("promo")}
            />
            <div
              role="tabpanel"
              className="tab-content bg-base-100 border-base-300 border p-4"
            >
              {active === "promo" && renderTabContent("promo")}
            </div>
          </div>

          {/* Logout Button for Mobile */}
          <div className="pt-8">
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-3 rounded-lg border-2 border-[#155E49] px-5 py-3 text-[#155E49] font-medium hover:bg-[#155E49]/5"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-5 w-5"
                >
                  <path d="M9 5l-7 7 7 7" />
                  <path d="M2 12h20" />
                </svg>
              </span>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
