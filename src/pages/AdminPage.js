import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/admin/sidebar/sidebar';
import Dashboard from '../components/admin/dashboard/dashboard'; // Impor Dashboard
import ProgramPage from './admin/ProgramPage'; // Impor ProgramPage
import DokumentasiPage from './admin/DokumentasiPage'; // Impor DokumentasiPage
import BuatDokumentasiPage from './admin/BuatDokumentasiPage'; // Impor BuatDokumentasiPage

const AdminPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50/80">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="dashboard" element={<Dashboard />} /> {/* /admin/dashboard */}
          <Route path="program" element={<ProgramPage />} /> {/* /admin/program */}
          <Route path="dokumentasi" element={<DokumentasiPage />} /> {/* /admin/dokumentasi */}
          <Route path="dokumentasi/buat" element={<BuatDokumentasiPage />} /> {/* /admin/dokumentasi/buat */}
          <Route index element={<Dashboard />} /> {/* Default route untuk /admin */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminPage;