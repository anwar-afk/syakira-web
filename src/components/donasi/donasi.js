import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCampaigns } from "../../services/campaignService";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import API_BASE_URL from "../../config/api";

// Komponen Header (DonasiHeader) - Premium SaaS Style
export const DonasiHeader = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const headerAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : "translateY(-30px)",
    config: { tension: 280, friction: 20 },
  });

  const handleScrollToContent = () => {
    const contentSection = document.getElementById("donasi-content");
    if (contentSection) {
      const yOffset = -80; // offset agar tidak tertutup navbar
      const y = contentSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-green-50/50 to-white pt-24 lg:pt-32 pb-16 overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl"></div>
      </div>

      <animated.div
        ref={ref}
        style={headerAnimation}
        className="container mx-auto px-6 lg:px-20 relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-12"
      >
        {/* Left Section - Text & CTA */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <div className="inline-block px-4 py-2 bg-green-100 rounded-full text-green-700 font-semibold text-sm mb-6 shadow-sm border border-green-200/50">
            ✨ Mari Bergerak Bersama
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            Bersama <br />
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Wujudkan Harapan
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Setiap donasi Anda adalah langkah kecil menuju perubahan besar.
            Bergabunglah dengan kami untuk membawa cahaya harapan bagi mereka yang membutuhkan.
          </p>
          <button
            onClick={handleScrollToContent}
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gray-900 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-black transition-all duration-300 hover:-translate-y-1"
          >
            Mulai Berdonasi
            <svg className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>

        {/* Right Section - Image */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96">
            {/* Dekorasi di belakang gambar */}
            <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-emerald-300 rounded-[3rem] transform rotate-6 scale-105 opacity-20"></div>
            
            <img
              src="/image/child smiling.png" // Pastikan path gambar ini benar
              alt="Anak Tersenyum"
              className="relative w-full h-full object-cover rounded-[3rem] shadow-2xl z-10"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; // Fallback premium image
              }}
            />
            
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl z-20 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Donasi Terkumpul</p>
                <p className="text-sm font-bold text-gray-900">Membantu Sesama</p>
              </div>
            </div>
          </div>
        </div>
      </animated.div>
    </div>
  );
};

// Komponen DonasiContent
export const DonasiContent = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Array kategori dengan format label yang rapi
  const categories = [
    { id: "all", label: "Semua Kategori" },
    { id: "bencana alam", label: "Bencana Alam" },
    { id: "pendidikan", label: "Pendidikan" },
    { id: "kesehatan", label: "Kesehatan" },
    { id: "kemanusiaan", label: "Kemanusiaan" },
    { id: "lingkungan", label: "Lingkungan" },
    { id: "lainnya", label: "Lainnya" },
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const campaignsArray = await getCampaigns();
        // Sortir campaign terbaru di atas
        const sortedCampaigns = campaignsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCampaigns(sortedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const isCategoryMatch = selectedCategory === "all" || campaign.category?.toLowerCase() === selectedCategory;
    return isCategoryMatch;
  });

  const visibleCampaigns = showAll ? filteredCampaigns : filteredCampaigns.slice(0, 10); // Tampilkan 10 kampanye terbaru

  return (
    <div id="donasi-content" className="bg-slate-50 py-16 lg:py-24">
      <div className="container mx-auto px-6 lg:px-20">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Pilih Program Kebaikan
          </h2>
          <p className="text-gray-600">
            Pilih program yang ingin Anda bantu. Sedikit dari Anda, sangat berarti bagi mereka.
          </p>
        </div>

        {/* Filter Navigation (Pills) */}
        <div className="flex justify-start md:justify-center overflow-x-auto pb-6 mb-8 scrollbar-hide space-x-2">
          <div className="inline-flex bg-white p-1.5 rounded-full shadow-sm border border-gray-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setShowAll(false); // Reset show all saat ganti kategori
                }}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? "bg-gray-900 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {visibleCampaigns.length > 0 ? (
                visibleCampaigns.map((campaign) => (
                  <CampaignCard key={campaign._id} campaign={campaign} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Program</h3>
                  <p className="text-gray-500">Belum ada program donasi aktif untuk kategori ini.</p>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {filteredCampaigns.length > 10 && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="px-8 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold hover:border-gray-900 hover:text-gray-900 transition-colors duration-300"
                >
                  {showAll ? "Tampilkan Lebih Sedikit" : `Lihat Semua Program (${filteredCampaigns.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Komponen CampaignCard - Desain Premium
const CampaignCard = ({ campaign }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const cardAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : "translateY(40px)",
    config: { tension: 280, friction: 20 },
  });

  const firstImage = campaign.images && campaign.images.length > 0
    ? `${API_BASE_URL}${campaign.images[0]}`
    : "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80"; // Fallback modern

  return (
    <animated.div ref={ref} style={cardAnimation}>
      <Link
        to={`/donation/${campaign._id}`}
        className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-green-900/5 transition-all duration-300 hover:-translate-y-1 h-full"
      >
        {/* Card Image Header */}
        <div className="relative h-52 w-full overflow-hidden">
          <img
            src={firstImage}
            alt={campaign.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
          
          {/* Floating Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold rounded-full shadow-sm">
              {campaign.category || "Umum"}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
            {campaign.title}
          </h3>
          
          {/* Sisa ruang didorong agar tombol selalu di bawah */}
          <div className="mt-auto pt-4">
            <div className="w-full py-3 bg-green-50 text-green-600 text-center font-semibold rounded-xl group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
              Donasi Sekarang
            </div>
          </div>
        </div>
      </Link>
    </animated.div>
  );
};

// Komponen Utama Donasi
const Donasi = () => {
  return (
    <div className="bg-white min-h-screen">
      <DonasiHeader />
      <DonasiContent />
    </div>
  );
};

export default Donasi;