import React, { useState } from 'react';

const ProgramForm = ({ programData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(programData ? programData.title : '');
  const [detail, setDetail] = useState(programData ? programData.detail : '');
  const [category, setCategory] = useState(programData ? programData.category : '');
  const [startDate, setStartDate] = useState(programData ? programData.startDate : '');
  const [endDate, setEndDate] = useState(programData ? programData.endDate : '');
  const [target, setTarget] = useState(programData ? programData.target : '');
  const [images, setImages] = useState([]);

  // Daftar kategori yang tersedia (value harus match dengan backend enum)
  const categories = [
    { value: "bencana_alam", label: "Bencana Alam" },
    { value: "pendidikan", label: "Pendidikan" },
    { value: "kesehatan", label: "Kesehatan" },
    { value: "kemanusiaan", label: "Kemanusiaan" },
    { value: "lingkungan", label: "Lingkungan" },
    { value: "lainnya", label: "Lainnya" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('detail', detail);
    formData.append('category', category);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('target', target);
    images.forEach((image) => {
      formData.append('images', image);
    });
    onSubmit(formData);
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Judul Program
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="detail">
          Detail Program
        </label>
        <textarea
          id="detail"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
          Kategori
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
          Tanggal Mulai
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
          Tanggal Berakhir
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="target">
          Target Donasi
        </label>
        <input
          type="number"
          id="target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
          Upload Gambar
        </label>
        <input
          type="file"
          id="images"
          onChange={handleImageChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          multiple
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
        >
          Batal
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default ProgramForm;