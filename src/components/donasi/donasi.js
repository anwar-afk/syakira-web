import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCampaigns } from "../../services/campaignService";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

// Komponen Header (DonasiHeader)
export const DonasiHeader = () => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const headerAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : "translateY(-50px)",
  });

  const handleScrollToContent = () => {
    const contentSection = document.getElementById("donasi-content");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <animated.div
      ref={ref}
      style={headerAnimation}
      className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-60 py-10 bg-green-100"
    >
      {/* Left Section */}
      <div className="lg:max-w-lg text-center lg:text-left mb-10 lg:mb-0">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-brown-800 mb-6">
          Bersama <br /> Wujudkan Harapan
        </h1>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Setiap donasi Anda adalah langkah kecil menuju perubahan besar.
          Bergabunglah dengan kami untuk membawa cahaya harapan bagi mereka yang membutuhkan.
        </p>
        <button
          onClick={handleScrollToContent}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600"
        >
          MAKE A DONATION
        </button>
      </div>

      {/* Right Section */}
      <div className="relative">
        <img
          src="/image/child smiling.png" // Ganti dengan path gambar
          alt="Child Smiling"
          className="w-64 h-64 lg:w-96 lg:h-96 object-cover rounded-full"
        />
        <div className="absolute bottom-0 left-0 transform -translate-x-10 translate-y-10">
          <div className="w-16 h-16 bg-green-400 rounded-full"></div>
        </div>
      </div>
    </animated.div>
  );
};

// Komponen DonasiContent
export const DonasiContent = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const categories = [
    "bencana alam",
    "pendidikan",
    "kesehatan",
    "kemanusiaan",
    "lingkungan",
    "lainnya",
  ];

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns();
        console.log("Fetched Campaigns:", data);
        const campaignsArray = Array.isArray(data) ? data : data.campaigns || data.data || [];
        setCampaigns(campaignsArray);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const isCategoryMatch = selectedCategory === "all" || campaign.category === selectedCategory;
    const isActive = new Date(campaign.endDate) > new Date();
    return isCategoryMatch && isActive;
  });

  const visibleCampaigns = showAll ? filteredCampaigns : filteredCampaigns.slice(0, 4);

  return (
    <div id="donasi-content" className="px-6 lg:px-40 py-10">
      <h1 className="text-4xl lg:text-5xl font-normal text-green-500 mb-10 mb-40 mt-20">
        Mari Bantu <span className="font-semibold">Mereka</span>
      </h1>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Donasi</h2>
        <div className="flex space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              console.log("Selected Category:", e.target.value);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleCampaigns.length > 0 ? (
          visibleCampaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))
        ) : (
          <p className="text-gray-600">Tidak ada campaign yang tersedia.</p>
        )}
      </div>
      {filteredCampaigns.length > 4 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 transition"
          >
            {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Lebih Banyak"}
          </button>
        </div>
      )}
    </div>
  );
};

// Komponen CampaignCard
const CampaignCard = ({ campaign }) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const cardAnimation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0px)" : "translateY(50px)",
  });

  // Ambil gambar pertama dari array images
  const firstImage = campaign.images && campaign.images.length > 0
    ? `http://localhost:5000${campaign.images[0]}`
    : "https://via.placeholder.com/150"; // Fallback image jika tidak ada gambar

  return (
    <animated.div ref={ref} style={cardAnimation}>
      <Link
        to={`/donation/${campaign._id}`}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <img
          src={firstImage}
          alt={campaign.title}
          className="w-full h-32 object-cover"
        />
        <div className="p-4">
          <span className="text-xs bg-green-100 text-green-600 font-medium px-2 py-1 rounded-full inline-block mb-2">
            {campaign.category}
          </span>
          <h3 className="text-md font-semibold text-gray-800 mb-2">
            {campaign.title}
          </h3>
          <div className="text-green-500 font-medium hover:underline flex items-center">
            Lihat Selengkapnya <span className="ml-1">→</span>
          </div>
        </div>
      </Link>
    </animated.div>
  );
};

// Komponen Utama Donasi
const Donasi = () => {
  return (
    <div>
      <DonasiHeader />
      <DonasiContent />
    </div>
  );
};

export default Donasi;