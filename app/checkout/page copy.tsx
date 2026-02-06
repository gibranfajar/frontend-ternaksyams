"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import axios from "axios";
import formatToIDR from "@/utils/formatToIdr";
import { getGuestToken } from "@/utils/guestToken";
import { toast } from "react-toastify";
import { clearCart } from "@/redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import goat from "@/public/images/ilustration/sheep-happy.png";

// --- START: KOMPONEN CHECKOUT MODAL BARU (DAISYUI) ---
interface CheckoutModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Komponen Modal menggunakan kelas daisyUI
const DaisyUICheckoutModal: React.FC<CheckoutModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  // Catatan: Di React, elemen <dialog> lebih baik dikontrol dengan `ref.current.showModal()`
  // Namun, untuk mempertahankan logika prop `isVisible` yang ada, kita akan menggunakan `open` attribute.
  // Untuk memastikan backdrop bekerja, kita akan menggunakan `modal-backdrop` atau `open`.

  // Agar sesuai dengan behaviour modal daisyUI, kita menggunakan tag <dialog>
  return (
    // Tambahkan `modal` class ke <dialog> tag
    // Atribut `open` akan membuat modal muncul dengan backdrop di kebanyakan browser.
    // Jika tidak bekerja dengan sempurna, solusi terbaik adalah menggunakan `ref` dan `showModal()`.
    // Saya menggunakan `open={isVisible}` untuk kompatibilitas.
    <dialog
      id="checkout_modal_daisy"
      className={`modal ${isVisible ? "modal-open" : ""}`} // Gunakan modal-open jika isVisible true
      // Jika Anda menggunakan `open` attribute, Anda mungkin tidak perlu `modal-open` class:
      // open={isVisible}
    >
      <div className="modal-box p-0 rounded-xl max-w-sm w-full">
        <div className="p-6">
          {/* Konten Ilustrasi & Pesan */}
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="w-full h-32 my-5 flex items-center justify-center">
              {/* Ikon dari Tailwind/Heroicons */}
              <img src={goat.src} alt="Checkout Illustration" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 my-5">
              Pembayaranmu akan langsung diproses
            </h3>
            <p className="text-sm text-gray-500">
              Sebelum lanjut, pastiin pesananmu sudah sesuai, ya
            </p>
          </div>
        </div>

        {/* Tombol Aksi - Menggunakan modal-action untuk tata letak tombol di bawah */}
        <div className="modal-action p-6 pt-0 flex justify-between gap-4">
          <form method="dialog" className="flex-1">
            {/* Tombol 'Cek Lagi' akan otomatis menutup modal jika berada di dalam <form method="dialog"> */}
            <button onClick={onClose} className="btn btn-outline flex-1 w-full">
              Cek Lagi
            </button>
          </form>
          <button
            onClick={onConfirm}
            className="btn btn-success flex-1 bg-green-900 hover:bg-green-800 text-white border-none"
          >
            Bayar
          </button>
        </div>
      </div>

      {/* Menutup modal ketika mengklik di luar area modal */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>tutup</button>
      </form>
    </dialog>
  );
};
// --- END: KOMPONEN CHECKOUT MODAL BARU (DAISYUI) ---

const Checkout = () => {
  const dispatch = useDispatch();
  const { cartItems } = useAppSelector((state) => state.cart);
  const { user, isUserLoading } = useAppSelector((state) => state.auth);
  const [province, setProvince] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherData, setVoucherData] = useState<any>(null);
  const [layanan, setLayanan] = useState([]);
  const sessionToken = getGuestToken();
  const [loading, setLoading] = useState(false);
  // ✅ State Baru untuk Modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // ... (Logika dan state lainnya tetap sama) ...
  const totalWeight = cartItems.reduce((total, item: any) => {
    const weight = parseInt(item.sizeName); // ambil angka di depan
    return total + weight;
  }, 0);

  const totalHarga = cartItems.reduce(
    (total, item: any) => total + item.total,
    0,
  );

  const kurir = [
    { id: 1, name: "SICEPAT", slug: "sicepat" },
    { id: 2, name: "JNE", slug: "jne" },
    { id: 3, name: "JNT", slug: "jnt" },
    { id: 4, name: "NINJA", slug: "ninja" },
  ];

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    district_name: "",
    subdistrict: "",
    subdistrict_name: "",
    city: "",
    city_name: "",
    province: "",
    province_name: "",
    postalCode: "",
    voucher: voucherCode,
    kurir: "",
    cost: 0,
    service: "",
    etd: "",
    shipping_cashback: "",
    grandtotal: "",
  });

  const router = useRouter();

  // ... (Efek samping/useEffect untuk data provinsi, kota, kecamatan, dan layanan tetap sama) ...
  // ✅ Ambil daftar provinsi sekali saat komponen mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/provinces`,
        );
        setProvince(response.data.data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };

    fetchProvinces();
  }, []);

  // ✅ Ambil daftar kota setiap kali province berubah
  useEffect(() => {
    const fetchCities = async () => {
      if (!data.province) return; // stop kalau belum pilih provinsi
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/cities/${data.province}`,
        );
        setCities(response.data.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, [data.province]);

  // ✅ Ambil daftar kecamatan setiap kali kota berubah
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!data.city) return; // stop kalau belum pilih kota
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/districts/${data.city}`,
        );
        setDistricts(response.data.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, [data.city]);

  // ✅ Ambil daftar kelurahan setiap kali kecamatan berubah
  useEffect(() => {
    const fetchSubdistricts = async () => {
      if (!data.district) return; // stop kalau belum pilih kecamatan
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/subdistricts/${data.district}`,
        );
        setSubdistricts(response.data.data);
      } catch (error) {
        console.error("Error fetching subdistricts:", error);
      }
    };

    fetchSubdistricts();
  }, [data.district]);

  // ✅ Ambil layanan setiap kali kurir, berat, dan harga barang berubah
  useEffect(() => {
    const fetchLayanan = async () => {
      if (
        !data.kurir ||
        !data.subdistrict ||
        totalWeight === 0 ||
        totalHarga === 0
      )
        return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/cost`,
          {
            params: {
              destination: data.subdistrict, // Komship destination ID
              weight: totalWeight, // gram
              total_price: totalHarga, // harga barang
              courier: data.kurir, // ninja, jne, dll
            },
          },
        );

        setLayanan(response.data.data);
      } catch (error) {
        console.error("Error fetching layanan:", error);
        setLayanan([]);
        toast.error("Gagal mengambil layanan kurir. Pilih kurir lain.");
      }
    };

    fetchLayanan();

    // reset cost & service kalau berubah
    setData((prev) => ({
      ...prev,
      cost: 0,
      service: "",
      etd: "",
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.district, data.kurir, totalWeight, totalHarga]);

  // handle apply voucher
  const handleApplyVoucher = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/apply-voucher`,
        {
          user_id: user?.id ?? null,
          code: voucherCode,
          session: sessionToken,
          total: totalHarga,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = response.data.data;
      setVoucherData(data);

      toast.success(`Voucher berhasil diterapkan! 🎉`);
    } catch (error: any) {
      // Jika ada response dari API
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Gagal menerapkan voucher. Coba lagi!");
      }
    }
  };

  let discount = 0;

  if (voucherData?.voucher_type === "shipping") {
    // Diskon ongkir → tidak boleh melebihi biaya shipping
    discount = Math.min(data.cost || 0, voucherData.discount_value || 0);
  } else {
    // Diskon normal → tidak dibatasi cost
    discount = voucherData?.discount_value || 0;
  }

  const totalAkhir = totalHarga + data.cost - discount;

  // 🆕 FUNGSI VALIDASI FORMULIR BARU
  const isFormValid = () => {
    // List field yang harus diisi, menggunakan variabel yang sudah ada
    const requiredFields = [
      { value: data.name || user?.name, name: "Nama Lengkap" },
      { value: data.email || user?.email, name: "Email" },
      { value: data.address || user?.address, name: "Alamat" },
      { value: data.province, name: "Provinsi" },
      { value: data.city, name: "Kota" },
      { value: data.district, name: "Kecamatan" },
      { value: data.postalCode || user?.postalCode, name: "Kode Pos" },
      { value: data.phone || user?.whatsapp, name: "No Whatsapp" },
      { value: data.kurir, name: "Kurir" },
      { value: data.cost, name: "Layanan Kurir" },
    ];

    for (const field of requiredFields) {
      // Cek apakah value kosong atau 0 (untuk cost)
      if (
        !field.value ||
        (field.name === "Layanan Kurir" && field.value === 0)
      ) {
        toast.error(`Harap lengkapi: ${field.name} sebelum melanjutkan.`);
        return false;
      }
    }

    if (cartItems.length === 0) {
      toast.error("Keranjang belanja kosong! Silakan tambah produk.");
      return false;
    }

    return true;
  };

  // ✅ handle modal poup pengecekan (Perbaikan Validasi Final)
  const handlePopupCheck = () => {
    // Tampilkan modal hanya jika validasi sukses
    if (isFormValid()) {
      setShowCheckoutModal(true);
    }
  };

  // handle checkout
  const handleCheckout = async () => {
    // Menutup modal setelah diklik Bayar
    setShowCheckoutModal(false);

    setLoading(true);
    try {
      let cartId = null;

      // 1️⃣ Tambahkan item ke cart (berurutan)
      for (const item of cartItems) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/cart/add`,
          {
            product_id: item.sizeId,
            user_id: user?.id ? Number(user?.id) : null,
            session: sessionToken,
            qty: item.quantity,
          },
          { headers: { "Content-Type": "application/json" } },
        );

        if (!cartId) cartId = response.data.data.cart_id;
      }

      // 2️⃣ Siapkan payload transaksi
      const payload = {
        voucher_code: data.voucher,
        cart_id: cartId,
        name: data.name || user?.name,
        email: data.email || user?.email,
        address: data.address || user?.address,
        province: data.province_name,
        city: data.city_name,
        district: data.district_name,
        destination_id: data.subdistrict,
        postal_code: data.postalCode || user?.postalCode,
        phone: data.phone || user?.whatsapp,
        courier: data.kurir,
        service: data.service,
        cost: data.cost,
        etd: data.etd,
        total: totalAkhir,
        note: "",
        total_weight: totalWeight,
        shipping_cashback: data?.shipping_cashback,
      };

      // 3️⃣ Kirim ke API /transaction
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transaction`,
        payload,
        { headers: { "Content-Type": "application/json" } },
      );

      console.log("📦 Response transaksi:", response.data);

      // 4️⃣ Ambil nomor invoice dan email user untuk diteruskan ke halaman thank you
      const invoiceNumber = response.data.invoice;
      const userEmail = payload.email;

      // 4️⃣ Ambil token Midtrans
      const snapToken =
        response.data.data?.snap_token || response.data.snap_token;

      if (snapToken && typeof window !== "undefined" && (window as any).snap) {
        (window as any).snap.pay(snapToken, {
          onSuccess: function (result: any) {
            dispatch(clearCart());
            toast.success("Pembayaran berhasil! 🎉");
            router.push(
              `/thankyou?invoice=${invoiceNumber}&email=${userEmail}`,
            );
          },
          onPending: function (result: any) {
            dispatch(clearCart());
            toast.info(
              "Pembayaran masih pending. Silakan selesaikan di Midtrans.",
            );
            router.push(
              `/thankyou?invoice=${invoiceNumber}&email=${userEmail}`,
            );
          },
          onError: function (result: any) {
            dispatch(clearCart());
            toast.error("Pembayaran gagal. Coba lagi!");
          },
          onClose: function () {
            dispatch(clearCart());
            toast.error("Pembayaran dibatalkan.");
          },
        });
      } else {
        console.error("Token Midtrans tidak ditemukan di response API");
        toast.error("Gagal mendapatkan token pembayaran. Coba lagi!");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Terjadi kesalahan saat checkout. Coba lagi!");
    } finally {
      setLoading(false);
    }
  };

  // 🆕 HANDLER PERUBAHAN PROVINCE BARU (Lebih Bersih)
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      setData((prev) => ({
        ...prev,
        province: "",
        province_name: "",
        city: "",
        city_name: "",
        district: "",
        district_name: "",
        kurir: "",
        cost: 0,
        service: "",
        etd: "",
      }));
      return;
    }
    const selected = JSON.parse(e.target.value);
    setData((prev) => ({
      ...prev,
      province: selected.id,
      province_name: selected.name,
      // Reset state di bawahnya secara konsisten saat province berubah
      city: "",
      city_name: "",
      district: "",
      district_name: "",
      kurir: "",
      cost: 0,
      service: "",
      etd: "",
    }));
  };

  // 🆕 HANDLER PERUBAHAN CITY BARU (Lebih Bersih)
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      setData((prev) => ({
        ...prev,
        city: "",
        city_name: "",
        district: "",
        district_name: "",
        kurir: "",
        cost: 0,
        service: "",
        etd: "",
      }));
      return;
    }
    const selected = JSON.parse(e.target.value);
    setData((prev) => ({
      ...prev,
      city: selected.id,
      city_name: selected.name,
      // Reset state di bawahnya secara konsisten saat city berubah
      district: "",
      district_name: "",
      kurir: "",
      cost: 0,
      service: "",
      etd: "",
    }));
  };

  // 🆕 HANDLER PERUBAHAN DISTRICT BARU (Lebih Bersih)
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      setData((prev) => ({
        ...prev,
        district: "",
        district_name: "",
        kurir: "",
        cost: 0,
        service: "",
        etd: "",
      }));
      return;
    }
    const selected = JSON.parse(e.target.value);

    setData((prev) => ({
      ...prev,
      district: selected.id,
      district_name: selected.name,
      // Reset state di bawahnya secara konsisten saat district berubah
      kurir: "",
      cost: 0,
      service: "",
      etd: "",
    }));
  };

  // 🆕 HANDLER PERUBAHAN SUBDISTRICT BARU (Lebih Bersih)
  const handleSubdistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      setData((prev) => ({
        ...prev,
        subdistrict: "",
        subdistrict_name: "",
        kurir: "",
        cost: 0,
        service: "",
        etd: "",
      }));
      return;
    }
    const selected = JSON.parse(e.target.value);
    setData((prev) => ({
      ...prev,
      subdistrict: selected.id,
      subdistrict_name: selected.name,
      // Reset state di bawahnya secara konsisten saat subdistrict berubah
      kurir: "",
      cost: 0,
      service: "",
      etd: "",
    }));
  };

  // 🆕 HANDLER PERUBAHAN KURIR BARU (Lebih Bersih)
  const handleKurirChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Reset layanan saat kurir berubah
    setData((prev) => ({
      ...prev,
      kurir: e.target.value,
      cost: 0,
      service: "",
      etd: "",
    }));
  };

  // 🆕 HANDLER PERUBAHAN LAYANAN BARU (Lebih Bersih)
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") {
      // Handle opsi default
      setData((prev) => ({
        ...prev,
        cost: 0,
        service: "",
        etd: "",
        shipping_cashback: "",
        grandtotal: "",
      }));
      return;
    }
    const selected = JSON.parse(e.target.value);
    setData((prev) => ({
      ...prev,
      cost: selected.cost,
      service: selected.service,
      etd: selected.etd,
      shipping_cashback: selected.shipping_cashback,
      grandtotal: selected.grandtotal,
    }));
  };

  if (isUserLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );

  // ... (Sisa komponen Checkout) ...
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Kolom Kiri */}
        <div className="space-y-8">
          {/* Contact */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-green-900">Contact</h2>
              <Link href="/login" className="text-sm text-green-700">
                Masuk Akun
              </Link>
            </div>
            <input
              type="email"
              placeholder="Email"
              value={data.email || user?.email || ""}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full h-11 rounded-md border border-gray-300 px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600/40"
            />
          </section>

          {/* Pengiriman */}
          <section>
            <h2 className="text-2xl font-semibold text-green-900 mb-4">
              Pengiriman
            </h2>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={data.name || user?.name || ""}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
              className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-600/40"
            />
            <input
              type="text"
              placeholder="Alamat"
              value={data.address || user?.address || ""}
              onChange={(e) => {
                setData({ ...data, address: e.target.value });
              }}
              className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full mb-4 focus:outline-none focus:ring-2 focus:ring-green-600/40"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* PROVINCE */}
              <select
                name="province"
                value={
                  data.province
                    ? JSON.stringify({
                        id: data.province,
                        name: data.province_name,
                      })
                    : ""
                }
                onChange={handleProvinceChange} // 🆕 Menggunakan handler baru
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              >
                <option value="">- Pilih Provinsi -</option>
                {province.map((prov: any) => (
                  <option
                    key={prov.id}
                    value={JSON.stringify({ id: prov.id, name: prov.name })}
                  >
                    {prov.name}
                  </option>
                ))}
              </select>

              {/* CITY */}
              <select
                name="city"
                value={
                  data.city
                    ? JSON.stringify({ id: data.city, name: data.city_name })
                    : ""
                }
                onChange={handleCityChange} // 🆕 Menggunakan handler baru
                disabled={!cities.length}
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              >
                <option value="">- Pilih Kota -</option>
                {cities.map((city: any) => (
                  <option
                    key={city.id}
                    value={JSON.stringify({ id: city.id, name: city.name })}
                  >
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                name="district"
                value={
                  data.district
                    ? JSON.stringify({
                        id: data.district,
                        name: data.district_name,
                      })
                    : ""
                }
                onChange={handleDistrictChange} // 🆕 Menggunakan handler baru
                disabled={!districts.length}
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              >
                <option value="">- Pilih Kecamatan -</option>
                {districts.map((district: any) => (
                  <option
                    key={district.id}
                    value={JSON.stringify({
                      id: district.id,
                      name: district.name,
                    })}
                  >
                    {district.name}
                  </option>
                ))}
              </select>

              <select
                name="subdistrict"
                value={
                  data.subdistrict
                    ? JSON.stringify({
                        id: data.subdistrict,
                        name: data.subdistrict_name,
                      })
                    : ""
                }
                onChange={handleSubdistrictChange} // 🆕 Menggunakan handler baru
                disabled={!subdistricts.length}
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              >
                <option value="">- Pilih Kelurahan -</option>
                {subdistricts.map((subdistrict: any) => (
                  <option
                    key={subdistrict.id}
                    value={JSON.stringify({
                      id: subdistrict.id,
                      name: subdistrict.name,
                    })}
                  >
                    {subdistrict.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Kode Pos"
                value={data.postalCode || user?.postalCode || ""}
                onChange={(e) => {
                  setData({ ...data, postalCode: e.target.value });
                }}
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              />
              <input
                type="text"
                placeholder="No Whatsapp"
                value={data.phone || user?.whatsapp || ""}
                onChange={(e) => {
                  setData({ ...data, phone: e.target.value });
                }}
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                name="kurir"
                value={data.kurir}
                onChange={handleKurirChange} // 🆕 Menggunakan handler baru
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
              >
                <option value="">- Pilih Kurir -</option>
                {kurir.map((kurir: any) => (
                  <option key={kurir.id} value={kurir.slug}>
                    {kurir.name}
                  </option>
                ))}
              </select>

              {/* LAYANAN KURIR */}
              <select
                name="cost"
                className="h-11 rounded-md border border-gray-300 px-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-green-600/40"
                value={
                  data.service
                    ? JSON.stringify({
                        cost: data.cost,
                        service: data.service,
                        etd: data.etd,
                        shipping_cashback: data.shipping_cashback,
                        grandtotal: data.grandtotal,
                      })
                    : ""
                }
                onChange={handleServiceChange} // 🆕 Menggunakan handler baru
                disabled={layanan.length === 0}
              >
                <option value="">
                  - Pilih Layanan{" "}
                  {layanan.length === 0 ? "(Kurir/Alamat Belum Lengkap)" : ""} -
                </option>

                {layanan.map((item: any, index) => (
                  <option
                    key={index}
                    value={JSON.stringify({
                      cost: item.shipping_cost,
                      service: item.service_name,
                      etd: item.etd,
                      shipping_cashback: item.shipping_cashback,
                      grandtotal: item.grandtotal,
                    })}
                  >
                    {item.service_name} - {formatToIDR(item.shipping_cost)} (
                    {item.etd} hari)
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Pembayaran */}
          <section>
            <h2 className="text-2xl font-semibold text-green-900 mb-2">
              Pembayaran
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Transactions are secure and encrypted.
            </p>
            <div className="border rounded-lg overflow-hidden mb-6">
              <div className="px-4 py-3 flex justify-between items-center bg-gray-50 border-b">
                <span className="text-sm font-medium">
                  Payments By Midtrans
                </span>
                <div className="flex gap-2">
                  <span className="border px-2 py-1 text-xs rounded">VISA</span>
                  <span className="border px-2 py-1 text-xs rounded">
                    MasterCard
                  </span>
                  <span className="border px-2 py-1 text-xs rounded">BCA</span>
                </div>
              </div>
            </div>
            {/* Button improve dengan modal popup dan validasi */}
            <button
              disabled={loading}
              type="submit"
              onClick={handlePopupCheck} // Panggil fungsi yang sudah memiliki validasi
              className="w-full h-12 bg-green-900 text-white font-semibold rounded-md hover:bg-green-800 cursor-pointer"
            >
              {loading ? "Loading..." : "Bayar Sekarang"}
            </button>
          </section>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-6">
          {/* Pesanan */}
          <section>
            <h2 className="text-2xl font-semibold text-green-900 mb-4">
              Pesanan
            </h2>
            <div className="space-y-4">
              {/* Cart Item */}
              {cartItems.map((item, idx) => (
                <div className="flex justify-between items-start" key={idx}>
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-16 w-16 rounded object-cover"
                      />
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">
                        {item.sizeName} gr
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.flavourName}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{formatToIDR(item.total)}</p>
                </div>
              ))}
            </div>

            {/* Voucher */}
            <div className="flex items-center gap-2 mt-6">
              <input
                value={voucherCode}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setVoucherCode(val);
                  setData((prev) => ({ ...prev, voucher: val }));
                }}
                placeholder="Voucher"
                className="h-11 rounded-md border border-gray-300 px-3 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-green-600/40"
              />
              <button
                onClick={handleApplyVoucher}
                disabled={!voucherCode}
                className={`h-11 px-4 rounded-md font-semibold ${
                  voucherCode
                    ? "bg-green-900 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Gunakan
              </button>
            </div>
          </section>

          {/* Ringkasan */}
          <section>
            <h2 className="text-2xl font-semibold text-green-900 mb-4">
              Ringkasan
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatToIDR(totalHarga)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{formatToIDR(data.cost)}</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span>Discount</span>
                <span>
                  {formatToIDR(
                    voucherData?.voucher_type === "shipping"
                      ? Math.min(
                          data.cost || 0,
                          voucherData?.discount_value || 0,
                        )
                      : voucherData?.discount_value || 0,
                  )}
                </span>
              </div>
              <p className="text-xs text-green-700">
                {voucherData?.voucher_type
                  ? voucherData.voucher_type.charAt(0).toUpperCase() +
                    voucherData.voucher_type.slice(1)
                  : ""}
              </p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between items-center">
              <span className="text-lg">Total</span>
              <span className="text-2xl font-semibold">
                {formatToIDR(totalAkhir)}
              </span>
            </div>
          </section>
        </div>
      </div>

      {/* ✅ Implementasi Komponen Modal DaisyUI Baru */}
      <DaisyUICheckoutModal
        isVisible={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onConfirm={handleCheckout} // Panggil handleCheckout saat diklik Bayar di modal
      />
    </div>
  );
};

export default Checkout;
