import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated, useInView } from '@react-spring/web';
import axios from 'axios';
import { getCampaigns } from '../../services/campaignService';

function FadeInComponent({ children }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const styles = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(20px)',
    config: { duration: 1000 },
  });

  return (
    <animated.div ref={ref} style={styles}>
      {children}
    </animated.div>
  );
}

// Komponen Hero Pertama - Premium SaaS Style
const Hero1 = () => {
  const [documentations, setDocumentations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocumentations = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/documentations'
        );
        const sortedDocs = response.data
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
        setDocumentations(sortedDocs);
      } catch (err) {
        console.error('Error fetching documentations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentations();
  }, []);

  // Ekstrak semua gambar menjadi satu array flat dan batasi hanya 4 gambar
  const allImages = documentations.flatMap((doc) =>
    doc.images && doc.images.length > 0
      ? doc.images.map((image) => ({ url: image, title: doc.title }))
      : []
  ).slice(0, 4);

  // Tentukan class grid asimetris untuk masing-masing urutan gambar (Bento Box style)
  const bentoClasses = [
    "lg:col-span-3", // Gambar 1 (Kiri Atas): Lebih lebar
    "lg:col-span-2", // Gambar 2 (Kanan Atas): Lebih sempit
    "lg:col-span-2", // Gambar 3 (Kiri Bawah): Lebih sempit
    "lg:col-span-3", // Gambar 4 (Kanan Bawah): Lebih lebar
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-20 overflow-hidden overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-700 text-sm font-medium">
                  ✨ Bersama Kita Bisa Berubah
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Mewujudkan <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Harapan</span>, <br />
                Memberi <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">Kehidupan Baru</span>
              </h1>
            </div>

            <div>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-lg">
                Setiap donasi Anda adalah langkah kecil menuju perubahan besar. Bergabunglah dengan ribuan orang yang peduli dalam misi kebaikan untuk membantu mereka yang membutuhkan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Link to="/donasi" className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/50 transform hover:scale-105 text-center text-sm sm:text-base">
                <span className="flex items-center justify-center gap-2">
                  Mulai Donasi
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white/80 hover:bg-white text-green-600 font-semibold rounded-lg border-2 border-green-500/30 hover:border-green-500 transition-all duration-300 backdrop-blur-sm hover:backdrop-blur shadow-md hover:shadow-lg text-sm sm:text-base">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  Pelajari Lebih Lanjut
                </span>
              </button>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold">Bergabung dengan Ribuan Donatur</p>
                  <p className="text-gray-600 text-sm">Membantu komunitas di seluruh negara</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Box Highlight Dokumentasi - Desktop */}
          <div className="hidden lg:block">
            {loading ? (
              <div className="grid grid-cols-5 gap-3 w-full">
                {[3, 2, 2, 3].map((span, i) => (
                  <div key={i} className={`col-span-${span} rounded-2xl bg-gray-200 h-[200px] animate-pulse`}></div>
                ))}
              </div>
            ) : allImages.length > 0 ? (
              <div className="grid grid-cols-5 gap-3 w-full">
                {allImages.map((imageObj, idx) => (
                  <div
                    key={idx}
                    className={`relative rounded-2xl overflow-hidden group h-[200px] shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer ${bentoClasses[idx] || "col-span-1"}`}
                  >
                    <img
                      src={`http://localhost:5000${imageObj.url}`}
                      alt={imageObj.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-[300px] bg-gray-100 rounded-2xl flex items-center justify-center">
                <p className="text-gray-400 text-sm">Belum ada dokumentasi</p>
              </div>
            )}
          </div>
        </div>

        {/* Bento Box Highlight Dokumentasi - Mobile */}
        <div className="lg:hidden mt-12">
          {loading ? (
            <div className="grid grid-cols-2 gap-3 w-full">
              {[1, 1, 1, 1].map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-200 aspect-[4/3] animate-pulse"></div>
              ))}
            </div>
          ) : allImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 w-full">
              {allImages.map((imageObj, idx) => (
                <div
                  key={idx}
                  className="relative rounded-2xl overflow-hidden group aspect-[4/3] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={`http://localhost:5000${imageObj.url}`}
                    alt={imageObj.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-[200px] bg-gray-100 rounded-2xl flex items-center justify-center">
              <p className="text-gray-400 text-sm">Belum ada dokumentasi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



// Komponen Program Kerja - Horizontal Scroll Carousel
const ProgramKerja = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns();
        const campaignsArray = Array.isArray(data) ? data : data.campaigns || data.data || [];
        const sortedCampaigns = campaignsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCampaigns(sortedCampaigns);
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat mengambil data campaign');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return (
    <div className="py-12 md:py-20 bg-white">
      <div className="px-4 md:px-10 lg:px-40 mb-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
      <div className="flex gap-4 px-4 md:px-10 lg:px-40 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-shrink-0" style={{ width: '180px' }}>
            <div className="aspect-[2/3] bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded mt-3 w-3/4 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return <div>Error: {error}</div>;

  return (
    <FadeInComponent>
      <div className="py-12 md:py-20 bg-white">
        {/* Header */}
        <div className="px-4 md:px-10 lg:px-40 mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Program Kerja</h2>
          <p className="text-gray-500 text-sm md:text-base mt-1">
            Program unggulan dan kegiatan sosial kami.
          </p>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          className="flex gap-4 md:gap-5 px-4 md:px-10 lg:px-40 overflow-x-auto pb-4 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {campaigns.map((campaign, index) => {
            const firstImage = campaign.images && campaign.images.length > 0
              ? `http://localhost:5000${campaign.images[0]}`
              : "https://via.placeholder.com/300x450";

            return (
              <Link
                to={`/donation/${campaign.id || campaign._id}`}
                key={campaign.id || campaign._id}
                className="flex-shrink-0 group cursor-pointer"
                style={{ width: '180px' }}
              >
                {/* Poster Image */}
                <div
                  className={`relative overflow-hidden rounded-2xl shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.03] ${
                    index === 0 ? 'aspect-[2/3]' : 'aspect-[2/3]'
                  }`}
                >
                  <img
                    src={firstImage}
                    alt={campaign.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay di bagian bawah */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Title */}
                <p className="mt-2.5 text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-200 line-clamp-1 px-0.5">
                  {campaign.title}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </FadeInComponent>
  );
};

// Komponen Utama
const HomePage = () => {
  return (
    <div>
      <Hero1 />
      <ProgramKerja />
    </div>
  );
};

export default HomePage;