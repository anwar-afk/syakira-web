import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { getCampaigns } from '../../services/campaignService';
import { AuthContext } from '../../context/AuthContext';
import { createDonation, getDonationHistory } from '../../services/donateService';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const DonationDetailPage = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [donationError, setDonationError] = useState(null);

  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
  });

  // Ambil data campaign dan riwayat donasi saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data campaign
        const campaignData = await getCampaigns();
        const campaignsArray = Array.isArray(campaignData) ? campaignData : campaignData.campaigns || campaignData.data || [];
        const selectedCampaign = campaignsArray.find((campaign) => campaign._id === id);
        if (selectedCampaign) {
          setCampaign(selectedCampaign);
        } else {
          setError("Data campaign tidak ditemukan.");
        }

        // Ambil riwayat donasi jika user sudah login
        if (user) {
          const historyData = await getDonationHistory();
          setDonationHistory(historyData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal memuat data.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openModal = () => {
    if (!user) {
      alert("Harap login dulu jika ingin berdonasi.");
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setAmount('');
    setDonationError(null);
  };

  const handleDonationSubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || amount <= 0) {
      setDonationError("Masukkan jumlah donasi yang valid.");
      return;
    }

    try {
      const response = await createDonation(id, amount);
      if (response.success) {
        window.location.href = response.paymentUrl;
      } else {
        setDonationError("Gagal membuat donasi. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error creating donation:", error);
      setDonationError(error.message || "Terjadi kesalahan saat membuat donasi.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat data campaign...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Data campaign tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <animated.div style={fadeIn} className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 sm:px-6 lg:px-20 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop={true}
              className="rounded-lg shadow-lg"
            >
              {campaign.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`http://localhost:5000${image}`}
                    alt={`Campaign Image ${index + 1}`}
                    className="w-full h-64 lg:h-96 object-cover rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="bg-white p-6 lg:p-8 rounded-lg shadow-md">
            <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
              {campaign.category}
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mt-4">{campaign.title}</h2>
            <p className="text-gray-600 mt-4 text-lg leading-relaxed">
              {campaign.detail}
            </p>
            <button
              onClick={openModal}
              className="w-full mt-6 px-6 py-3 bg-green-500 text-white text-lg rounded-full shadow-md hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
            >
              Donasi Sekarang
            </button>
          </div>
        </div>

        {/* Riwayat Donasi */}
        <section className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800">Riwayat Donasi</h3>
          <div className="mt-6 space-y-6">
            {user ? (
              donationHistory.filter((donation) => donation.paymentStatus === 'success').length > 0 ? (
                donationHistory
                  .filter((donation) => donation.paymentStatus === 'success')
                  .map((donation) => (
                    <div key={donation._id} className="flex justify-between items-center border-b pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-gray-600"></i>
                        </div>
                        <div>
                          <p className="text-gray-800 font-semibold">Anda</p>
                          <p className="text-sm text-gray-600">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {donation.paymentStatus}
                          </p>
                        </div>
                      </div>
                      <p className="text-green-600 font-bold">
                        Rp. {donation.amount.toLocaleString()}
                      </p>
                    </div>
                  ))
              ) : (
                <p className="text-gray-600">Belum ada donasi yang berhasil.</p>
              )
            ) : (
              <p className="text-gray-600">Login dan lihat riwayat donasi kamu.</p>
            )}
          </div>
        </section>

        {!user && (
          <div className="mt-8">
            <Link
              to="/login"
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transform hover:scale-105 transition-all duration-300"
            >
              Login untuk Donasi
            </Link>
          </div>
        )}
      </main>

      {/* Modal untuk Donasi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Donasi Sekarang</h2>
            <form onSubmit={handleDonationSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                  Jumlah Donasi (Rp)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Masukkan jumlah donasi"
                  required
                />
              </div>
              {donationError && (
                <p className="text-red-500 text-sm mb-4">{donationError}</p>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Donasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </animated.div>
  );
};

export default DonationDetailPage;