import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/documentations",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      console.log("Dokumentasi berhasil dibuat:", response.data);
      setTimeout(() => {
        navigate("/admin/dokumentasi"); // Redirect ke halaman dokumentasi setelah berhasil
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat membuat dokumentasi.");
      console.error("Error creating documentation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-6">Buat Dokumentasi Baru</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Input Judul */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Judul Dokumentasi
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Input Tanggal */}
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Tanggal
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Input Gambar */}
        <div className="mb-4">
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">
            Upload Gambar (Bisa multiple)
          </label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleImageChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {loading ? "Mengunggah..." : "Buat Dokumentasi"}
        </button>

        {/* Tampilkan pesan error */}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        {/* Tampilkan pesan sukses */}
        {success && (
          <p className="mt-4 text-sm text-green-500">
            Dokumentasi berhasil dibuat! Mengalihkan...
          </p>
        )}
      </form>
    </div>
  );
};

export default BuatDokumentasiPage;