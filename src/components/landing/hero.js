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

// Komponen Dokumentasi Carousel untuk Card Hero
const DocumentationCarouselCard = () => {
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

  if (loading)
    return (
      <div className="w-full aspect-[9/16] bg-gray-900 rounded-lg flex items-center justify-center">
        <p className="text-gray-400 text-sm">Memuat...</p>
      </div>
    );

  return (
    <>
      {documentations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5 w-full aspect-auto lg:aspect-[4/3]">
          {(() => {
            // 1. Ekstrak semua gambar menjadi satu array flat dan batasi hanya 4 gambar
            const allImages = documentations.flatMap((doc) =>
              doc.images && doc.images.length > 0
                ? doc.images.map((image) => ({ url: image, title: doc.title }))
                : []
            ).slice(0, 4);

            // Jika array kosong setelah di-flat
            if (allImages.length === 0) {
              return <div className="text-gray-500 col-span-full text-center">Tidak ada foto dokumentasi.</div>;
            }

            // 2. Tentukan class grid asimetris untuk masing-masing urutan gambar (Bento Box style)
            const bentoClasses = [
              "lg:col-span-3", // Gambar 1 (Kiri Atas): Lebih lebar
              "lg:col-span-2", // Gambar 2 (Kanan Atas): Lebih sempit
              "lg:col-span-2", // Gambar 3 (Kiri Bawah): Lebih sempit
              "lg:col-span-3", // Gambar 4 (Kanan Bawah): Lebih lebar
            ];

            return allImages.map((imageObj, idx) => (
              <div
                key={idx}
                className={`relative rounded-2xl overflow-hidden group min-h-[250px] lg:min-h-0 ${bentoClasses[idx] || "col-span-1"}`}
              >
                <img
                  src={`http://localhost:5000${imageObj.url}`}
                  alt={imageObj.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Opsional: Overlay gradient halus agar terlihat lebih premium */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
              </div>
            ));
          })()}
        </div>
      ) : (

        <div className="w-full aspect-[9/16] bg-gray-800 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 text-sm">Tidak ada dokumentasi</p>
        </div>
      )}
    </>
  );
};

// Komponen Hero Pertama - Premium SaaS Style
const Hero1 = () => {
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

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-full max-w-xs">
              <DocumentationCarouselCard />
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-12 flex justify-center">
          <div className="relative w-full max-w-64">
            <DocumentationCarouselCard />
          </div>
        </div>
      </div>
    </div>
  );
};



// Komponen Highlight Dokumentasi (Bento Box Style)
const DocumentationHighlights = () => {
  return (
    <FadeInComponent>
      <div className="px-4 md:px-10 lg:px-40 py-12 md:py-20 bg-gray-50/50">
        <div className="text-center mb-8 md:mb-12 max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Highlight Dokumentasi
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Momen-momen berharga dari kegiatan penyaluran bantuan, edukasi, dan aksi sosial kami di lapangan.
          </p>
        </div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5 max-w-7xl mx-auto">
          {/* Baris 1: Kiri (Lebar: col-span-3), Kanan (Sempit: col-span-2) */}
          <div className="lg:col-span-3 rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-200 aspect-[4/3] lg:aspect-auto lg:h-[350px] shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group cursor-pointer">
            <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              alt="Highlight Dokumentasi 1"
              className="w-full h-full object-cover bg-gray-200 transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="lg:col-span-2 rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-200 aspect-[4/3] lg:aspect-auto lg:h-[350px] shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group cursor-pointer">
            <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              alt="Highlight Dokumentasi 2"
              className="w-full h-full object-cover bg-gray-200 transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Baris 2: Kiri (Sempit: col-span-2), Kanan (Lebar: col-span-3) */}
          <div className="lg:col-span-2 rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-200 aspect-[4/3] lg:aspect-auto lg:h-[350px] shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group cursor-pointer">
            <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              alt="Highlight Dokumentasi 3"
              className="w-full h-full object-cover bg-gray-200 transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="lg:col-span-3 rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-200 aspect-[4/3] lg:aspect-auto lg:h-[350px] shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group cursor-pointer">
            <img
              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              alt="Highlight Dokumentasi 4"
              className="w-full h-full object-cover bg-gray-200 transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </FadeInComponent>
  );
};

// Komponen Program Kerja
const ProgramKerja = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns();
        const campaignsArray = Array.isArray(data) ? data : data.data || [];
        const sortedCampaigns = campaignsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCampaigns(sortedCampaigns.slice(0, 3));
      } catch (err) {
        setError(err.message || 'Terjadi kesalahan saat mengambil data campaign');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <FadeInComponent>
      <div className="px-4 md:px-10 lg:px-40 py-12 md:py-20 bg-white">
        <div className="text-center mb-8 md:mb-10 max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Program Kerja</h2>
          <p className="text-gray-600 text-sm md:text-base">
            The Nexcent blog is the best place to read about the latest membership insights.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10 px-4 md:px-0">
          {campaigns.map((campaign) => {
            // Ambil gambar pertama dari array images
            const firstImage = campaign.images && campaign.images.length > 0
              ? `http://localhost:5000${campaign.images[0]}`
              : "https://via.placeholder.com/150"; // Fallback image jika tidak ada gambar

            return (
              <Link
                to={`/donation/${campaign._id}`}
                key={campaign._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={firstImage}
                  alt={campaign.title}
                  className="w-full h-40 md:h-48 object-cover rounded-t-lg"
                />
                <div className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 line-clamp-2">{campaign.title}</h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base line-clamp-2">{campaign.detail}</p>
                  <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center">
                    <span className="text-xs md:text-sm text-gray-500 truncate">Target: Rp {campaign.target.toLocaleString()}</span>
                    <span className="text-xs md:text-sm text-gray-500 truncate">Terkumpul: Rp {campaign.currentAmount.toLocaleString()}</span>
                  </div>
                </div>
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
      <DocumentationHighlights />
      <ProgramKerja />
    </div>
  );
};

export default HomePage;