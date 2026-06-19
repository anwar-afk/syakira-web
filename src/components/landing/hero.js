import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated, useInView } from '@react-spring/web';
import { getCampaigns } from '../../services/campaignService';
import { getStatistics } from '../../services/statisticService'; // Import service untuk statistik

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
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-6 py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-700 text-sm font-medium">
                  ✨ Bersama Kita Bisa Berubah
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Mewujudkan <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">Harapan</span>, <br />
                Memberi <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">Kehidupan Baru</span>
              </h1>
            </div>

            <div>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Setiap donasi Anda adalah langkah kecil menuju perubahan besar. Bergabunglah dengan ribuan orang yang peduli dalam misi kebaikan untuk membantu mereka yang membutuhkan.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/donasi" className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/50 transform hover:scale-105 text-center">
                <span className="flex items-center justify-center gap-2">
                  Mulai Donasi
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <button className="group relative px-8 py-4 bg-white/80 hover:bg-white text-green-600 font-semibold rounded-lg border-2 border-green-500/30 hover:border-green-500 transition-all duration-300 backdrop-blur-sm hover:backdrop-blur shadow-md hover:shadow-lg">
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
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-2xl overflow-hidden border border-green-100/50 backdrop-blur">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Program Donasi Kami</h3>
                  <p className="text-green-100">Dampak nyata untuk kehidupan yang lebih baik</p>
                </div>

                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-3xl font-bold text-green-600">5K+</p>
                      <p className="text-gray-600 text-sm mt-1">Donatur Aktif</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <p className="text-3xl font-bold text-emerald-600">50+</p>
                      <p className="text-gray-600 text-sm mt-1">Program Sosial</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700">Program Unggulan:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-gray-700">Pendidikan Anak Kurang Mampu</p>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-gray-700">Bantuan Kesehatan Masyarakat</p>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <p className="text-gray-700">Penanggulangan Bencana Alam</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-200">
                    <p className="text-2xl font-bold text-green-600">Rp. 2.5 Miliar</p>
                    <p className="text-gray-600 text-sm mt-1">Dana Terkumpul Tahun Ini</p>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-500/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-12 flex justify-center">
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-2xl overflow-hidden border border-green-100/50 p-6 space-y-4">
              <div className="h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded w-2/3"></div>
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              <div className="h-12 bg-green-100 rounded mt-4 border-2 border-green-300"></div>
              <div className="space-y-2 pt-4">
                <div className="h-2 bg-gray-300 rounded"></div>
                <div className="h-2 bg-gray-300 rounded w-4/5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Komponen Summary
const Summary = () => {
  const [statistics, setStatistics] = useState({
    totalSuccessfulDonations: 0,
    totalRegisteredUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getStatistics(); // Ambil data statistik
        setStatistics({
          totalSuccessfulDonations: data.totalSuccessfulDonations,
          totalRegisteredUsers: data.totalRegisteredUsers,
        });
      } catch (err) {
        setError(err.message || 'Gagal mengambil data statistik');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <FadeInComponent>
      <div className="bg-green-100 px-10 lg:px-40 py-20 flex flex-col lg:flex-row items-center lg:justify-between">
        <div className="lg:max-w-md mb-10 lg:mb-0">
          <h2 className="text-3xl font-bold text-gray-800">
            Bantu Donasi <br />
            <span className="text-green-500">Yayasan Kami</span>
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            We reached here with our hard work and dedication
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center lg:space-x-10">
          <div className="flex items-center space-x-4">
            <img src="/image/ic-hero3.svg" alt="Donatur Icon" />
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {statistics.totalSuccessfulDonations.toLocaleString()}
              </p>
              <p className="text-gray-600">Donatur</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-8 lg:mt-0">
            <img src="/image/hand-ic-hero3.svg" alt="Komunitas Icon" />
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {statistics.totalRegisteredUsers.toLocaleString()}
              </p>
              <p className="text-gray-600">Komunitas</p>
            </div>
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
      <div className="px-10 lg:px-40 py-20 bg-white">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Program Kerja</h2>
          <p className="text-gray-600">
            The Nexcent blog is the best place to read about the latest membership insights.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">{campaign.title}</h3>
                  <p className="text-gray-600 mb-4">{campaign.detail}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Target: Rp {campaign.target.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">Terkumpul: Rp {campaign.currentAmount.toLocaleString()}</span>
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
      <ProgramKerja />
    </div>
  );
};

export default HomePage;