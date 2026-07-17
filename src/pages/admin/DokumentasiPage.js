import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../config/api";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
// Import required modules
import { Pagination, Navigation } from "swiper/modules";

const DokumentasiPage = () => {
  const [documentations, setDocumentations] = useState([]); // State untuk menyimpan data dokumentasi
  const [loading, setLoading] = useState(true); // State untuk loading
  const [error, setError] = useState(null); // State untuk error

  // Fetch semua data dokumentasi
  useEffect(() => {
    const fetchDocumentations = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/documentations`
        );
        setDocumentations(response.data); // Simpan data ke state
        setLoading(false); // Set loading ke false setelah data diterima
      } catch (err) {
        setError(err.message); // Tangani error
        setLoading(false); // Set loading ke false meskipun ada error
      }
    };

    fetchDocumentations();
  }, []);

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Fungsi untuk menghapus dokumentasi
  const handleDeleteDocumentation = async (documentationId) => {
    try {
      const token = localStorage.getItem("token"); // Ambil token dari localStorage
      await axios.delete(
        `${API_BASE_URL}/api/documentations/${documentationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan token ke header
          },
        }
      );
      // Perbarui state dengan menghapus dokumentasi yang telah dihapus
      setDocumentations(documentations.filter(doc => doc._id !== documentationId));
    } catch (err) {
      console.error("Error deleting documentation:", err);
    }
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dokumentasi</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola dokumentasi kegiatan Syakira Berkah</p>
        </div>
        <Link
          to="/admin/dokumentasi/buat"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-syakira-500 to-syakira-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          <span>Buat Dokumentasi</span>
        </Link>
      </div>

      {/* Tampilkan data dokumentasi */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-2xl p-6 text-center">
          <p className="text-red-500 font-medium">Error: {error}</p>
        </div>
      ) : documentations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentations.map((doc) => (
            <div key={doc._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
              {/* Swiper untuk menampilkan gambar */}
              {doc.images && doc.images.length > 0 && (
                <Swiper
                  pagination={{ type: "fraction" }}
                  navigation={true}
                  modules={[Pagination, Navigation]}
                  className="mySwiper"
                >
                  {doc.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={`${API_BASE_URL}${image}`}
                        alt={`Dokumentasi ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {/* Detail dokumentasi */}
              <div className="p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">{doc.title}</h2>
                <div className="flex items-center space-x-4 text-xs text-gray-400 mb-3">
                  <span className="flex items-center space-x-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>{formatDate(doc.date)}</span>
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteDocumentation(doc._id)}
                  className="w-full px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="font-medium text-gray-500">Belum ada dokumentasi</p>
          <p className="text-sm text-gray-400 mt-1">Klik "Buat Dokumentasi" untuk menambah</p>
        </div>
      )}
    </div>
  );
};

export default DokumentasiPage;