import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProgramForm from '../../components/admin/JS_programForm'; // Sesuaikan path
import API_BASE_URL from '../../config/api';

const ProgramPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(null); // Untuk menyimpan program yang dipilih (edit)
  const [campaigns, setCampaigns] = useState([]); // Untuk menyimpan data campaigns
  const [modalIsOpen, setModalIsOpen] = useState(false); // State untuk mengontrol modal
  const [notification, setNotification] = useState(null); // State untuk notifikasi

  // Ambil token dari localStorage
  const token = localStorage.getItem('token');


  // Fungsi untuk mengambil data campaigns
  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/campaigns`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan token ke header
          },
        }
      );
      const responseData = response.data;
      const campaignsArray = Array.isArray(responseData) ? responseData : responseData.campaigns || responseData.data || [];
      setCampaigns(campaignsArray);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  // Ambil data campaigns saat komponen pertama kali di-render
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Fungsi untuk membuat program baru
  const handleCreateProgram = async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/campaigns`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // Tambahkan token ke header
          },
        }
      );
      fetchCampaigns(); // Refresh data campaigns setelah membuat program baru
      showNotification('Program berhasil dibuat!', 'success'); // Tampilkan notifikasi sukses
      return response.data;
    } catch (error) {
      console.error('Error creating program:', error);
      showNotification('Gagal membuat program.', 'error'); // Tampilkan notifikasi error
      throw error;
    }
  };

  // Fungsi untuk mengedit program
  const handleUpdateProgram = async (data) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/campaigns/${selectedProgram.id || selectedProgram._id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // Tambahkan token ke header
          },
        }
      );
      fetchCampaigns(); // Refresh data campaigns setelah mengedit program
      setSelectedProgram(null); // Reset selected program setelah update
      setModalIsOpen(false); // Tutup modal setelah berhasil
      showNotification('Program berhasil diperbarui!', 'success'); // Tampilkan notifikasi sukses
      return response.data;
    } catch (error) {
      console.error('Error updating program:', error);
      showNotification('Gagal memperbarui program.', 'error'); // Tampilkan notifikasi error
      throw error;
    }
  };

  // Fungsi untuk menghapus program
  const handleDeleteProgram = async (campaignId) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/api/campaigns/${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Tambahkan token ke header
          },
        }
      );
      fetchCampaigns(); // Refresh data campaigns setelah menghapus program
      showNotification('Program berhasil dihapus!', 'success'); // Tampilkan notifikasi sukses
    } catch (error) {
      console.error('Error deleting program:', error);
      showNotification('Gagal menghapus program.', 'error'); // Tampilkan notifikasi error
    }
  };

  // Fungsi untuk menampilkan notifikasi
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null); // Hapus notifikasi setelah 3 detik
    }, 3000);
  };

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Program</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola program Syakira Berkah</p>
      </div>

      {/* Form Buat/Edit Program */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Buat Program Baru</h2>
        <ProgramForm onSubmit={handleCreateProgram} />
      </div>

      {/* Daftar Program */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Daftar Program</h2>
        </div>
        {campaigns.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-medium">Belum ada program</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {campaigns.map((campaign) => (
              <div key={campaign.id || campaign._id} className="px-6 py-4 flex items-center space-x-4 hover:bg-gray-50/50 transition-colors">
                {campaign.images && campaign.images[0] ? (
                  <img src={`${API_BASE_URL}${campaign.images[0]}`} alt={campaign.title} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-syakira-50 flex items-center justify-center">
                    <svg className="w-6 h-6 text-syakira-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{campaign.title}</p>
                  <p className="text-xs text-gray-400">{campaign.date ? new Date(campaign.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => { setSelectedProgram(campaign); setModalIsOpen(true); }} className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Edit</button>
                  <button onClick={() => handleDeleteProgram(campaign.id || campaign._id)} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal untuk Edit Program */}
      {modalIsOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Edit Program</h2>
              <button onClick={() => setModalIsOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <ProgramForm programData={selectedProgram} onSubmit={handleUpdateProgram} onCancel={() => setModalIsOpen(false)} />
          </div>
        </div>
      )}

      {/* Notifikasi */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg z-50 ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ProgramPage;