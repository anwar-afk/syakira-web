import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
          "http://localhost:5000/api/documentations"
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
        `http://localhost:5000/api/documentations/${documentationId}`,
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
      <h1 className="text-3xl font-bold mb-6">Dokumentasi Page</h1>
      <p className="text-gray-700 mb-6">
        Ini adalah halaman untuk mengelola dokumentasi.
      </p>

      {/* Tombol "Buat Dokumentasi" */}
      <Link
        to="/admin/dokumentasi/buat"
        className="mb-6 inline-block px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Buat Dokumentasi
      </Link>

      {/* Tampilkan data dokumentasi */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : documentations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentations.map((doc) => (
            <div key={doc._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Swiper untuk menampilkan gambar */}
              {doc.images.length > 0 && (
                <Swiper
                  pagination={{
                    type: "fraction",
                  }}
                  navigation={true}
                  modules={[Pagination, Navigation]}
                  className="mySwiper"
                >
                  {doc.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={`Dokumentasi ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {/* Detail dokumentasi */}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
                <p className="text-sm text-gray-500">
                  Tanggal: {formatDate(doc.date)}
                </p>
                <p className="text-sm text-gray-500">
                  Dibuat pada: {formatDate(doc.createdAt)}
                </p>
                {/* Tombol Delete */}
                <button
                  onClick={() => handleDeleteDocumentation(doc._id)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Tidak ada dokumentasi.</p>
      )}
    </div>
  );
};

export default DokumentasiPage;