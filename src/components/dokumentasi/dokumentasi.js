import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Album = () => {
  const [documentations, setDocumentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentDate = new Date();
  const maxYear = currentDate.getFullYear();
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

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

  const handleNextYear = () => {
    if (currentYear < maxYear) {
      setCurrentYear(currentYear + 1);
    }
  };

  const handlePrevYear = () => {
    if (currentYear > 2024) {
      setCurrentYear(currentYear - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth < 11) {
      setCurrentMonth(currentMonth + 1);
    } else {
      if (currentYear < maxYear) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      }
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth > 0) {
      setCurrentMonth(currentMonth - 1);
    } else {
      if (currentYear > 2024) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      }
    }
  };

  const fadeProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  // Filter dokumentasi berdasarkan tahun dan bulan
  const filteredDocumentations = documentations.filter((doc) => {
    const docDate = new Date(doc.date);
    return (
      docDate.getFullYear() === currentYear &&
      docDate.getMonth() === currentMonth
    );
  });

  return (
    <animated.div style={fadeProps} className="bg-white text-gray-800 min-h-screen px-6 lg:px-40 py-10">
      {/* Header */}
      <div className="border-b border-gray-300 pb-6">
        <h1 className="text-3xl font-bold mb-2">Dokumentasi</h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-500">Foto</p>
        </div>
      </div>

      {/* Year Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-4xl font-bold">{currentYear}</h2>
          <div className="flex gap-4">
            <button
              onClick={handlePrevYear}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                currentYear <= 2024 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
              }`}
              disabled={currentYear <= 2024}
            >
              <span className="material-icons">Tahun sebelumnya</span>
            </button>
            <button
              onClick={handleNextYear}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                currentYear >= maxYear ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
              }`}
              disabled={currentYear >= maxYear}
            >
              <span className="material-icons">Tahun setelahnya</span>
            </button>
          </div>
        </div>
        <p className="text-gray-600 text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Month Section */}
      <div className="mt-10 border-b border-gray-300 pb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">{months[currentMonth]}</h3>
          <div className="flex gap-4">
            <button
              onClick={handlePrevMonth}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                currentYear === 2024 && currentMonth === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
              }`}
              disabled={currentYear === 2024 && currentMonth === 0}
            >
              <span className="material-icons">chevron_left</span>
            </button>
            <button
              onClick={handleNextMonth}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                currentYear === maxYear && currentMonth === currentDate.getMonth() ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'
              }`}
              disabled={currentYear === maxYear && currentMonth === currentDate.getMonth()}
            >
              <span className="material-icons">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Tampilkan dokumentasi */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-600">Memuat dokumentasi...</p>
          </div>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : filteredDocumentations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocumentations.map((doc) => (
              <div key={doc._id} className="bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <div className="relative">
                  {/* Swiper untuk multiple images */}
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    className="w-full h-48"
                  >
                    {doc.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={`http://localhost:5000${image}`}
                          alt={`${doc.title} - ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <span className="absolute top-3 left-3 bg-gray-700 text-white text-xs px-2 py-1 rounded">
                    {doc.title}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-lg font-semibold">{doc.title}</h4>
                  <p className="text-sm text-gray-500 mt-4 flex items-center">
                    <span className="material-icons text-sm mr-2">calendar_today</span>
                    {formatDate(doc.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Tidak ada dokumentasi untuk bulan ini.</p>
        )}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-10">
        <button className="flex items-center text-green-500 font-semibold hover:underline">
          <span className="mr-2 material-icons">arrow_forward</span>
          Lihat Lebih Banyak
        </button>
      </div>
    </animated.div>
  );
};

export default Album;