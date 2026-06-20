import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProgramForm from '../../components/admin/JS_programForm'; // Sesuaikan path

const ProgramPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(null); // Untuk menyimpan program yang dipilih (edit)
  const [campaigns, setCampaigns] = useState([]); // Untuk menyimpan data campaigns
  const [modalIsOpen, setModalIsOpen] = useState(false); // State untuk mengontrol modal
  const [notification, setNotification] = useState(null); // State untuk notifikasi

  // Ambil token dari localStorage
  const token = localStorage.getItem('token');

  // Base URL API
  const baseUrl = 'http://localhost:5000';

  // Fungsi untuk mengambil data campaigns
  const fetchCampaigns = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/campaigns`,
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
        `${baseUrl}/api/campaigns`,
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
        `${baseUrl}/api/campaigns/${selectedProgram.id || selectedProgram._id}`,
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
        `${baseUrl}/api/campaigns/${campaignId}`,
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
      <h1 className="text-3xl font-bold mb-6">Program Admin</h1>

      {/* Form Buat/Edit Program */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Buat Program Baru</h2>
        <ProgramForm
          onSubmit={handleCreateProgram} // Fungsi untuk membuat program baru
        />
      </div>

      {/* Daftar Program */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Daftar Program</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Title</th>
              <th className="py-2 px-4 border-b">Images</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id || campaign._id}>
                <td className="py-2 px-4 border-b">{campaign.title}</td>
                <td className="py-2 px-4 border-b">
                  <div className="flex space-x-2">
                    {campaign.images.map((image, index) => (
                      <img
                        key={index}
                        src={`${baseUrl}${image}`} // Gabungkan base URL dengan path gambar
                        alt={`Campaign Image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </td>
                <td className="py-2 px-4 border-b">{new Date(campaign.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => {
                      setSelectedProgram(campaign);
                      setModalIsOpen(true); // Buka modal saat tombol edit diklik
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProgram(campaign.id || campaign._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal untuk Edit Program */}
      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-md w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Program</h2>
            <ProgramForm
              programData={selectedProgram} // Kirim data program jika sedang edit
              onSubmit={handleUpdateProgram} // Fungsi untuk mengedit program
              onCancel={() => setModalIsOpen(false)} // Tutup modal saat tombol cancel diklik
            />
          </div>
        </div>
      )}

      {/* Notifikasi */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-md text-white ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ProgramPage;