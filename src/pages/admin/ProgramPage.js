import React, { useState, useEffect } from 'react';
import ProgramForm from '../../components/admin/JS_programForm';
import API_BASE_URL from '../../config/api';
import {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from '../../services/campaignService';
import { getErrorMessage } from '../../utils/getErrorMessage';

const ProgramPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const fetchCampaigns = async () => {
    try {
      const list = await getCampaigns();
      setCampaigns(list);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      showNotification(getErrorMessage(error, 'Gagal memuat program.'), 'error');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateProgram = async (data) => {
    try {
      const result = await createCampaign(data);
      fetchCampaigns();
      showNotification('Program berhasil dibuat!', 'success');
      return result;
    } catch (error) {
      console.error('Error creating program:', error);
      showNotification(getErrorMessage(error, 'Gagal membuat program.'), 'error');
      throw error;
    }
  };

  const handleUpdateProgram = async (data) => {
    try {
      const id = selectedProgram.id || selectedProgram._id;
      const result = await updateCampaign(id, data);
      fetchCampaigns();
      setSelectedProgram(null);
      setModalIsOpen(false);
      showNotification('Program berhasil diperbarui!', 'success');
      return result;
    } catch (error) {
      console.error('Error updating program:', error);
      showNotification(getErrorMessage(error, 'Gagal memperbarui program.'), 'error');
      throw error;
    }
  };

  const handleDeleteProgram = async (campaignId) => {
    try {
      await deleteCampaign(campaignId);
      fetchCampaigns();
      showNotification('Program berhasil dihapus!', 'success');
    } catch (error) {
      console.error('Error deleting program:', error);
      showNotification(getErrorMessage(error, 'Gagal menghapus program.'), 'error');
    }
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