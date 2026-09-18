import React, { useState } from 'react';
import { createCampaign } from '../../services/campaignService';
import { getErrorMessage } from '../../utils/getErrorMessage';

const CreateProgram = () => {
  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    category: '',
    startDate: '',
    endDate: '',
    target: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: files,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('detail', formData.detail);
    data.append('category', formData.category);
    data.append('startDate', formData.startDate);
    data.append('endDate', formData.endDate);
    data.append('target', formData.target);

    formData.images.forEach((image) => {
      data.append('images', image);
    });

    try {
      await createCampaign(data);
      alert('Program berhasil dibuat!');

      setFormData({
        title: '',
        detail: '',
        category: '',
        startDate: '',
        endDate: '',
        target: '',
        images: [],
      });
    } catch (err) {
      setError(getErrorMessage(err, 'Gagal membuat program. Silakan coba lagi.'));
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold mb-6">Buat Program Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Judul Program */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul Program:
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Input Detail Program */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detail Program:
          </label>
          <textarea
            name="detail"
            value={formData.detail}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Input Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori:
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Input Tanggal Mulai */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Mulai:
          </label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Input Tanggal Berakhir */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Berakhir:
          </label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Input Target Donasi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Donasi:
          </label>
          <input
            type="number"
            name="target"
            value={formData.target}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Input Upload Gambar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Gambar (Bisa lebih dari satu):
          </label>
          <input
            type="file"
            name="images"
            onChange={handleFileChange}
            multiple // Mengizinkan multiple file upload
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Tampilkan preview gambar yang dipilih */}
        {formData.images.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview Gambar:
            </label>
            <div className="flex space-x-2">
              {formData.images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)} // Tampilkan preview gambar
                  alt={`Preview ${index + 1}`}
                  className="w-16 h-16 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )}

        {/* Tampilkan pesan error jika ada */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? 'Membuat Program...' : 'Buat Program'}
        </button>
      </form>
    </div>
  );
};

export default CreateProgram;