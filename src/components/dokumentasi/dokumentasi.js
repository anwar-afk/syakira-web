import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import axios from "axios";

const Album = () => {
  const [documentations, setDocumentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data dokumentasi dari API
  useEffect(() => {
    const fetchDocumentations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/documentations"
        );
        setDocumentations(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDocumentations();
  }, []);

  const fadeProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  return (
    <animated.div style={fadeProps} className="bg-green-100 min-h-screen px-4 pt-24 pb-12 lg:px-12">
      {/* 1. Background gradient & Padding Top */}
      
      {/* 2. Centered Text Container */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 tracking-tight">
          Galeri Dokumentasi
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Selamat datang di halaman galeri. Di sini Anda dapat menjelajahi semua momen, 
          kegiatan, dan kenangan yang telah kami abadikan. Gulir ke bawah untuk melihat 
          kumpulan foto selengkapnya.
        </p>
      </div>

      {/* Tampilkan Semua Foto dengan Masonry Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500">Memuat dokumentasi...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">Error: {error}</p>
      ) : documentations.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {documentations.map((doc) =>
            doc.images && doc.images.length > 0 ? (
              doc.images.map((image, index) => (
                <div
                  key={`${doc._id}-${index}`}
                  className="break-inside-avoid overflow-hidden rounded-xl inline-block w-full mb-4 bg-white group relative cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={`Documentation ${index}`}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))
            ) : null
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-10">Tidak ada dokumentasi ditemukan.</p>
      )}

      {/* Load More Button */}
      <div className="flex justify-center mt-12 mb-8">
        <button className="flex items-center text-green-700 font-semibold hover:underline opacity-80 hover:opacity-100 transition-opacity">
          <span className="mr-2 material-icons">arrow_forward</span>
          Lihat Lebih Banyak
        </button>
      </div>
    </animated.div>
  );
};

export default Album;