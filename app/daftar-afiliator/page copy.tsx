"use client";

import React, { useState } from "react";
import axios from "axios";

interface AffiliateForm {
  name: string;
  whatsapp: string;
  email: string;
  province: string;
  city: string;
  sosmed_account: string;
  shopee_account: string;
  tokopedia_account: string;
  tiktok_account: string;
  lazada_account: string;
  agree: boolean;
}

const DaftarAffiliate: React.FC = () => {
  const [formData, setFormData] = useState<AffiliateForm>({
    name: "",
    whatsapp: "",
    email: "",
    province: "",
    city: "",
    sosmed_account: "",
    shopee_account: "",
    tokopedia_account: "",
    tiktok_account: "",
    lazada_account: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, agree: e.target.checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) {
      setErrorMsg("Anda harus menyetujui Syarat dan Ketentuan.");
      setErrorOpen(true);
      return;
    }

    setLoading(true);
    setErrorOpen(false);

    try {
      const {
        name,
        whatsapp,
        email,
        province,
        city,
        sosmed_account,
        shopee_account,
        tokopedia_account,
        tiktok_account,
        lazada_account,
      } = formData;

      const { data }: { data: any } = await axios.post(
        "https://ts.crx.my.id/api/affiliate/register",
        {
          name,
          whatsapp,
          email,
          province,
          city,
          sosmed_account,
          shopee_account,
          tokopedia_account,
          tiktok_account,
          lazada_account,
        }
      );

      if (data?.message === "Affiliate created successfully") {
        setSuccessOpen(true);
        setFormData({
          name: "",
          whatsapp: "",
          email: "",
          province: "",
          city: "",
          sosmed_account: "",
          shopee_account: "",
          tokopedia_account: "",
          tiktok_account: "",
          lazada_account: "",
          agree: false,
        });
      } else {
        setErrorMsg(data?.message || "Pendaftaran gagal. Coba lagi.");
        setErrorOpen(true);
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || "Terjadi kesalahan.");
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="mx-auto w-full max-w-md py-10 px-4">
        <h1 className="text-3xl font-extrabold text-center text-primary">
          Daftar Afiliator
        </h1>
        <p className="text-center text-sm mt-2 text-base-content/70">
          Harap isi form berikut ini dengan data yang valid
        </p>

        <div className="card bg-white shadow-md mt-6">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="font-semibold text-sm text-base-content/80">
                Data Diri Mitra
              </p>
              <input
                type="text"
                name="name"
                placeholder="Nama Lengkap"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  name="whatsapp"
                  placeholder="No Whatsapp"
                  className="input input-bordered w-full tabular-nums"
                  pattern="[0-9]*"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="province"
                  placeholder="Provinsi"
                  className="input input-bordered w-full"
                  value={formData.province}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Kota"
                  className="input input-bordered w-full"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <p className="font-semibold text-sm text-base-content/80 mt-2">
                Username Akun Media Sosial
              </p>
              <div className="flex gap-2">
                <img src="/images/medsos/instagram.svg" alt="Instagram"></img>
                <input
                  type="text"
                  name="sosmed_account"
                  placeholder="Instagram"
                  className="input input-bordered w-full"
                  value={formData.sosmed_account}
                  onChange={handleChange}
                  required
                />
              </div>

              <p className="font-semibold text-sm text-base-content/80 mt-2">
                Username Akun Affiliate
              </p>
              <div className="flex gap-2">
                <img src="/images/medsos/shopee.svg" alt="shopee"></img>
                <input
                  type="text"
                  name="shopee_account"
                  placeholder="Shopee"
                  className="input input-bordered w-full"
                  value={formData.shopee_account}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-2">
                <img src="/images/medsos/tokopedia.svg" alt="tokopedia"></img>
                <input
                  type="text"
                  name="tokopedia_account"
                  placeholder="Tokopedia"
                  className="input input-bordered w-full"
                  value={formData.tokopedia_account}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-2">
                <img src="/images/medsos/tiktok.svg" alt="tiktok"></img>
                <input
                  type="text"
                  name="tiktok_account"
                  placeholder="TikTok"
                  className="input input-bordered w-full"
                  value={formData.tiktok_account}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-2">
                <img src="/images/medsos/lazada.svg" alt="lazada"></img>
                <input
                  type="text"
                  name="lazada_account"
                  placeholder="Lazada"
                  className="input input-bordered w-full"
                  value={formData.lazada_account}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control mt-2">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={formData.agree}
                    onChange={handleCheck}
                  />
                  <span className="label-text text-sm">
                    Menyetujui Syarat dan Ketentuan yang berlaku
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full mt-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Daftar Sekarang"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-yellow-100 rounded-box p-4 mt-6 text-sm text-center text-base-content/80">
          Konfirmasi pendaftaran akan dikirimkan ke email anda, <br />
          Tim kami akan menghubungi anda dalam 2×24 Jam
        </div>
      </div>

      {/* Modal Sukses */}
      <dialog className={`modal ${successOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Pendaftaran Berhasil!</h3>
          <p className="py-4">
            Konfirmasi pendaftaran telah dikirimkan ke email Anda. Tim kami akan
            menghubungi Anda dalam 2×24 jam.
          </p>
          <div className="modal-action">
            <button className="btn" onClick={() => setSuccessOpen(false)}>
              Tutup
            </button>
          </div>
        </div>
      </dialog>

      {/* Modal Error */}
      <dialog className={`modal ${errorOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Pendaftaran Gagal</h3>
          <p className="py-4">{errorMsg}</p>
          <div className="modal-action">
            <button className="btn" onClick={() => setErrorOpen(false)}>
              Tutup
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default DaftarAffiliate;
