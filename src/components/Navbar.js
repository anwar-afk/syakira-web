import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isGuest } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Tutup menu mobile setiap kali pindah halaman
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar?');
    if (confirmLogout) {
      logout();
    }
  };

  // Daftar navigasi untuk memudahkan mapping
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Donasi', path: '/donasi' },
    { name: 'Dokumentasi', path: '/dokumentasi' },
    { name: 'Laporan', path: '/laporan' },
    { name: 'Tentang', path: '/tentang' },
  ];

  return (
    /* WRAPPER LUAR: Membuat navbar mengambang di tengah (Fixed, Top-4) */
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 sm:px-6">
      
      {/* NAVBAR PILL (KAPSUL): Glassmorphism, shadow, rounded-full */}
      <nav className="flex items-center justify-between w-full max-w-5xl px-3 py-2.5 bg-white/80 backdrop-blur-md border border-gray-200/60 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative">
        
        {/* Kiri: Logo & Nama */}
        <Link to="/" className="flex items-center space-x-2.5 pl-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            <img src="/logo.svg" alt="Yayasan Syakira Berkah" className="h-5 w-5 object-contain" />
          </div>
          <span className="text-base font-bold text-gray-900 tracking-tight hidden sm:block">
            Syakira Berkah
          </span>
        </Link>

        {/* Tengah: Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Kanan: Auth Buttons (Desktop) */}
        <div className="hidden lg:flex items-center space-x-2 pr-1">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700 px-2">
                {isGuest ? 'Tamu' : user.username}
              </span>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200"
              >
                Keluar
              </button>
            </div>
          ) : (
            <>
              {/* Login berbentuk teks (Ghost Button) */}
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign in
              </Link>
              {/* Sign Up berbentuk pil hitam (Solid Black Button) */}
              <Link
                to="/register"
                className="px-5 py-2.5 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="lg:hidden pr-2">
          <button 
            onClick={toggleMenu} 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* DROPDOWN MENU (Mobile) - Muncul sebagai card melayang di bawah kapsul navbar */}
      {isMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl overflow-hidden lg:hidden flex flex-col p-4 space-y-1 z-50">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-colors"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="h-px bg-gray-100 my-3"></div>
          
          {user ? (
            <div className="flex flex-col space-y-2">
              <span className="px-4 py-2 text-sm font-medium text-gray-700 text-center">
                Hi, {isGuest ? 'Tamu' : user.username}
              </span>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-2xl transition-colors text-center"
              >
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link
                to="/login"
                className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-2xl transition-colors text-center"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="w-full px-4 py-3 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-2xl transition-colors text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;