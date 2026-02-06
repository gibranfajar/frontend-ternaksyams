"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

type LocationOption = {
  id: number;
  name: string;
};

type FormState = {
  name: string;
  whatsapp: string;
  email: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postal_code: string;
  bank: string;
  account_name: string;
  account_number: string;
  agree: boolean;
};

const DaftarReseller: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    whatsapp: "",
    email: "",
    address: "",
    province: "",
    city: "",
    district: "",
    postal_code: "",
    bank: "",
    account_name: "",
    account_number: "",
    agree: false,
  });

  // State untuk menyimpan opsi data dari API
  const [provinces, setProvinces] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [status, setStatus] = useState<{
    type: "" | "success" | "error";
    message: string;
  }>({
    type: "",
    message: "",
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // 1. Ambil data Provinsi saat pertama kali load
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get(`${baseUrl}/provinces`);
        setProvinces(res.data.data);
      } catch (err) {
        console.error("Error fetch provinces", err);
      }
    };
    fetchProvinces();
  }, [baseUrl]);

  // 2. Ambil data Kota saat Provinsi berubah
  useEffect(() => {
    if (form.province) {
      const fetchCities = async () => {
        try {
          const res = await axios.get(`${baseUrl}/cities/${form.province}`);
          setCities(res.data.data);
          // Reset pilihan di bawahnya jika provinsi diganti
          setForm((prev) => ({ ...prev, city: "", district: "" }));
          setDistricts([]);
        } catch (err) {
          console.error("Error fetch cities", err);
        }
      };
      fetchCities();
    }
  }, [form.province, baseUrl]);

  // 3. Ambil data Kecamatan saat Kota berubah
  useEffect(() => {
    if (form.city) {
      const fetchDistricts = async () => {
        try {
          const res = await axios.get(`${baseUrl}/districts/${form.city}`);
          setDistricts(res.data.data);
          setForm((prev) => ({ ...prev, district: "" }));
        } catch (err) {
          console.error("Error fetch districts", err);
        }
      };
      fetchDistricts();
    }
  }, [form.city, baseUrl]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onlyDigits = (s: string) => s.replace(/\D/g, "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!form.agree) {
      setStatus({
        type: "error",
        message: "Anda harus menyetujui S&K terlebih dahulu.",
      });
      return;
    }

    // --- PENYESUAIAN PAYLOAD DENGAN API POST BARU ---
    const payload = {
      name: form.name,
      whatsapp: onlyDigits(form.whatsapp),
      email: form.email,
      address: form.address,
      province_id: Number(form.province), // Konversi ID ke Number
      city_id: Number(form.city), // Konversi ID ke Number
      district_id: Number(form.district), // Konversi ID ke Number
      postal_code: Number(form.postal_code),
      bank: form.bank,
      account_name: form.account_name,
      account_number: onlyDigits(form.account_number),
    };

    try {
      setSubmitting(true);
      // Endpoint POST : {{base_url}}/reseller/register
      await axios.post(`${baseUrl}/reseller/register`, payload);

      setStatus({
        type: "success",
        message:
          "Pendaftaran berhasil! Kami akan menghubungi Anda via WhatsApp/Email.",
      });

      // Reset form ke kondisi awal
      setForm({
        name: "",
        whatsapp: "",
        email: "",
        address: "",
        province: "",
        city: "",
        district: "",
        postal_code: "",
        bank: "",
        account_name: "",
        account_number: "",
        agree: false,
      });
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message || err?.message || "Terjadi kesalahan.";
      setStatus({ type: "error", message: apiMsg });
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => setStatus({ type: "", message: "" });

  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      <div className="mx-auto w-full max-w-sm md:max-w-md px-4 py-10">
        <h1 className="text-3xl font-extrabold text-center text-primary">
          Daftar Reseller
        </h1>
        <p className="mt-2 text-center text-sm text-base-content/70">
          Harap isi form berikut ini dengan data yang valid
        </p>

        <div className="card bg-white shadow-md mt-6">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="font-semibold text-sm text-base-content/80">
                Data Diri Mitra
              </p>

              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Nama Lengkap"
                className="input input-bordered w-full"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  name="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={onChange}
                  placeholder="No WhatsApp"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="input input-bordered w-full tabular-nums"
                  required
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Email"
                  type="email"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <input
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Alamat Lengkap"
                className="input input-bordered w-full"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* SELECT PROVINSI */}
                <select
                  name="province"
                  value={form.province}
                  onChange={onChange}
                  className="select select-bordered w-full rounded-lg px-2"
                  required
                >
                  <option value="">Provinsi</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                {/* SELECT KOTA */}
                <select
                  name="city"
                  value={form.city}
                  onChange={onChange}
                  className="select select-bordered w-full rounded-lg px-2"
                  required
                  disabled={!form.province}
                >
                  <option value="">Kota</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {/* SELECT KECAMATAN */}
                <select
                  name="district"
                  value={form.district}
                  onChange={onChange}
                  className="select select-bordered w-full rounded-lg px-2"
                  required
                  disabled={!form.city}
                >
                  <option value="">Kecamatan</option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <input
                  name="postal_code"
                  value={form.postal_code}
                  onChange={onChange}
                  placeholder="Kode Pos"
                  inputMode="numeric"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <p className="font-semibold text-sm text-base-content/80 mt-2">
                Data Rekening Pembayaran
              </p>

              <input
                name="bank"
                value={form.bank}
                onChange={onChange}
                placeholder="Nama Bank (contoh: BCA, BRI, Mandiri)"
                className="input input-bordered w-full"
                required
              />
              <input
                name="account_number"
                value={form.account_number}
                onChange={onChange}
                placeholder="No Rekening"
                inputMode="numeric"
                className="input input-bordered w-full"
                required
              />
              <input
                name="account_name"
                value={form.account_name}
                onChange={onChange}
                placeholder="Nama Rekening"
                className="input input-bordered w-full"
                required
              />

              <div className="form-control mt-2">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={form.agree}
                    onChange={onChange}
                    className="checkbox checkbox-sm"
                  />
                  <span className="label-text text-sm">
                    Menyetujui{" "}
                    <a className="underline cursor-pointer">
                      Syarat dan Ketentuan
                    </a>{" "}
                    yang berlaku
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary w-full mt-2"
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Daftar Sekarang"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-yellow-100 rounded-box p-4 mt-6 text-sm text-base-content/80">
          Konfirmasi pendaftaran akan dikirimkan ke email anda, <br />
          Tim kami akan menghubungi anda dalam 2×24 Jam
        </div>
      </div>

      {/* Modal Sukses */}
      <dialog
        className={`modal ${status.type === "success" ? "modal-open" : ""}`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Pendaftaran Berhasil!</h3>
          <p className="py-4">{status.message}</p>
          <div className="modal-action">
            <button className="btn" onClick={closeModal}>
              Tutup
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>

      {/* Modal Error */}
      <dialog
        className={`modal ${status.type === "error" ? "modal-open" : ""}`}
      >
        <div className="modal-box border-t-4 border-error">
          <h3 className="font-bold text-lg text-error">Pendaftaran Gagal</h3>
          <p className="py-4">{status.message}</p>
          <div className="modal-action">
            <button className="btn" onClick={closeModal}>
              Tutup
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeModal}>close</button>
        </form>
      </dialog>
    </main>
  );
};

export default DaftarReseller;
