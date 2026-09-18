import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDocumentation } from "../../services/documentationService";
import { getErrorMessage } from "../../utils/getErrorMessage";

const BuatDokumentasiPage = () => {
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !date || images.length === 0) {
      setError("Judul, tanggal, dan gambar harus diisi.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("date", date);
      images.forEach((image) => {
        formData.append("images", image);
      });

      await createDocumentation(formData);

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/dokumentasi");
      }, 2000);
    } catch (err) {
      setError(getErrorMessage(err, "Terjadi kesalahan saat membuat dokumentasi."));
      console.error("Error creating documentation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Buat Dokumentasi Baru</h1>
        <p className="text-sm text-gray-500 mt-1">Tambahkan dokumentasi kegiatan baru</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Judul */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Judul Dokumentasi
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-syakira-500/20 focus:border-syakira-500 transition-all"
              placeholder="Masukkan judul dokumentasi"
              required
            />
          </div>

          {/* Input Tanggal */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-syakira-500/20 focus:border-syakira-500 transition-all"
              required
            />
          </div>
        </div>

        {/* Input Gambar */}
        <div className="mt-6">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Gambar (Bisa multiple)
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-syakira-300 transition-colors">
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="file"
              id="images"
              multiple
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ position: 'relative' }}
              required
            />
            <p className="text-sm text-gray-500">Klik atau seret gambar ke sini</p>
            {images.length > 0 && (
              <p className="text-sm text-syakira-600 font-medium mt-2">{images.length} gambar dipilih</p>
            )}
          </div>
        </div>

        {/* Tombol Submit */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-syakira-500 to-syakira-600 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Mengunggah..." : "Buat Dokumentasi"}
          </button>
        </div>

        {/* Tampilkan pesan error */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-xl">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Tampilkan pesan sukses */}
        {success && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-xl">
            <p className="text-sm text-emerald-500">Dokumentasi berhasil dibuat! Mengalihkan...</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default BuatDokumentasiPage;