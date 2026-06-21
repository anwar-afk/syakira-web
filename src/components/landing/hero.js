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

// Helper untuk generate angka acak
const getRandomInRange = (min, max) => Math.random() * (max - min) + min;

// Fungsi untuk posisi acak di sudut dalam CARD
const generateCornerPositions = () => {
  return [
    { top: `${getRandomInRange(4, 22)}%`, left: `${getRandomInRange(4, 15)}%` },
    { top: `${getRandomInRange(4, 22)}%`, right: `${getRandomInRange(4, 15)}%` },
    { bottom: `${getRandomInRange(4, 22)}%`, left: `${getRandomInRange(4, 15)}%` },
    { bottom: `${getRandomInRange(4, 22)}%`, right: `${getRandomInRange(4, 15)}%` },
  ];
};

// Komponen Hero Pertama
const Hero1 = () => {
  const [imagePool, setImagePool] = useState([]); 
  const [activeSlots, setActiveSlots] = useState([]); 
  const [isVisible, setIsVisible] = useState(false); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocumentations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/documentations');
        const pool = response.data.flatMap((doc) =>
          doc.images && doc.images.length > 0
            ? doc.images.map((image) => ({ url: image, title: doc.title }))
            : []
        );
        setImagePool(pool);
      } catch (err) {
        console.error('Error fetching documentations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentations();
  }, []);

  const randomizePhotosAndPositions = () => {
    if (imagePool.length === 0) return;
    const randomPositions = generateCornerPositions();
    let selectedPhotos = [];
    let shuffled = [...imagePool].sort(() => 0.5 - Math.random());
    
    for(let i = 0; i < 4; i++) {
      selectedPhotos.push(shuffled[i % shuffled.length]);
    }

    const nextActiveSlots = selectedPhotos.map((photo, i) => ({
      ...photo,
      id: i, 
      position: randomPositions[i], 
    }));
    setActiveSlots(nextActiveSlots);
  };

  useEffect(() => {
    if (loading || imagePool.length === 0) return;
    if (activeSlots.length === 0) {
      randomizePhotosAndPositions();
      setTimeout(() => setIsVisible(true), 100); 
    }
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        randomizePhotosAndPositions();
        setIsVisible(true);
      }, 600); 
    }, 4000); 
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, imagePool]); 

  return (
    <div className="w-full bg-white px-4 sm:px-6 lg:px-10 py-6 lg:py-10 block">
      <div className="relative min-h-[80vh] md:min-h-[85vh] lg:min-h-[90vh] w-full flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-20 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden border border-gray-100">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl opacity-60"></div>
        </div>

        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        ></div>

        {activeSlots.map((item) => (
          <div
            key={item.id}
            className="absolute w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-2xl overflow-hidden shadow-md group z-20"
            style={{
              ...(item.position.top ? { top: item.position.top } : {}),
              ...(item.position.bottom ? { bottom: item.position.bottom } : {}),
              ...(item.position.left ? { left: item.position.left } : {}),
              ...(item.position.right ? { right: item.position.right } : {}),
              opacity: isVisible ? 1 : 0, 
              transform: isVisible ? 'scale(1)' : 'scale(0.8)', 
              transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out', 
            }}
          >
            <img
              src={`http://localhost:5000${item.url}`}
              alt={item.title || "Dokumentasi"}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
          </div>
        ))}

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="space-y-8 text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight max-w-3xl">
              Mewujudkan <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Harapan</span>, <br />
              Memberi <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">Kehidupan Baru</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Setiap donasi Anda adalah langkah kecil menuju perubahan besar. Bergabunglah dengan ribuan orang yang peduli dalam misi kebaikan untuk membantu mereka yang membutuhkan.
            </p>
            <div className="flex justify-center pt-4 w-full">
              <Link 
                to="/donasi" 
                className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 text-center text-lg z-30 shadow-xl shadow-green-500/40 hover:shadow-2xl hover:shadow-green-600/60"
              >
                <span className="flex items-center justify-center gap-2">
                  Mulai Donasi
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen Program Kerja - Carousel Looping Otomatis (Tanpa Click & Hover Pause)
const ProgramKerja = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Semua');

  const categories = ['Semua', 'Pendidikan', 'Kesehatan', 'Kemanusiaan', 'Lingkungan', 'Bencana Alam'];

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

  const filteredCampaigns = activeTab === 'Semua' 
    ? campaigns 
    : campaigns.filter(c => c.category?.toLowerCase() === activeTab.toLowerCase());

  // Logika menduplikasi data jika item sedikit
  let infiniteCampaigns = [...filteredCampaigns];
  if (infiniteCampaigns.length > 0 && infiniteCampaigns.length < 6) {
    infiniteCampaigns = [...infiniteCampaigns, ...infiniteCampaigns, ...infiniteCampaigns, ...infiniteCampaigns];
  }

  // Fungsi Helper untuk merender kartu (Sekarang menggunakan <div>, bukan <Link>)
  const renderCard = (campaign, uniqueKey) => {
    const firstImage = campaign.images && campaign.images.length > 0
      ? `http://localhost:5000${campaign.images[0]}`
      : "https://via.placeholder.com/600x1200";

    return (
      <div
        key={uniqueKey}
        // Menghapus 'cursor-pointer' karena kartu ini sudah tidak bisa diklik
        className="flex-shrink-0 flex flex-col items-center w-[200px] sm:w-[240px]"
      >
        {/* Title */}
        <h3 className="mb-4 text-sm font-bold text-gray-900 w-full text-center px-2 truncate">
          {campaign.title}
        </h3>
        
        {/* Poster Image - Efek hover pop-up tetap dipertahankan untuk estetika 3D */}
        <div className="relative w-full h-[400px] sm:h-[480px] overflow-hidden rounded-[2rem] shadow-xl shadow-gray-300/60 bg-gray-50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-400/60 group">
          <img
            src={firstImage}
            alt={campaign.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2rem]"></div>
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="py-20 bg-white">
      <div className="flex flex-col items-center mb-12">
        <div className="h-12 bg-gray-200 rounded-lg w-3/4 max-w-md animate-pulse mb-8"></div>
        <div className="h-10 bg-gray-200 rounded-full w-96 animate-pulse"></div>
      </div>
      <div className="flex gap-6 px-4 md:px-10 lg:px-40 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-shrink-0 flex flex-col items-center w-[200px] sm:w-[240px]">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="w-full h-[400px] sm:h-[480px] bg-gray-200 rounded-[2rem] animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return <div>Error: {error}</div>;

  return (
    <FadeInComponent>
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            /* 40 detik durasi putaran */
            animation: marquee 40s linear infinite; 
          }
        `}
      </style>

      <div className="py-20 bg-white overflow-hidden overflow-x-hidden">
        <div className="text-center px-4 mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Program sosial kami <br className="hidden sm:block" /> dalam hitungan detik.
          </h2>

          <div className="mt-8 flex justify-center px-4">
            <div className="inline-flex bg-gray-100 p-1.5 rounded-full space-x-1 overflow-x-auto scrollbar-hide border border-gray-200/50">
              {categories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm border border-gray-200/40'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredCampaigns.length > 0 ? (
          <div className="relative w-full overflow-hidden pb-12 pt-6">
            
            <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            {/* TRACK ANIMASI: Menghapus class 'hover:[animation-play-state:paused]' */}
            <div className="flex w-max animate-marquee">
              
              <div className="flex gap-6 md:gap-8 pr-6 md:pr-8">
                {infiniteCampaigns.map((campaign, idx) => 
                  renderCard(campaign, `set1-${campaign._id || campaign.id}-${idx}`)
                )}
              </div>
              
              <div className="flex gap-6 md:gap-8 pr-6 md:pr-8">
                {infiniteCampaigns.map((campaign, idx) => 
                  renderCard(campaign, `set2-${campaign._id || campaign.id}-${idx}`)
                )}
              </div>

            </div>
          </div>
        ) : (
          <div className="w-full text-center py-20">
            <p className="text-gray-500 text-lg">Tidak ada program untuk kategori ini.</p>
          </div>
        )}

      </div>
    </FadeInComponent>
  );
};

// KOMPONEN UTAMA
const HomePage = () => {
  return (
    <div className="bg-white min-h-screen">
      <Hero1 />
      <ProgramKerja />
    </div>
  );
};

export default HomePage;