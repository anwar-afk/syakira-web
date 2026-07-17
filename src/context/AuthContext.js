import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // Tambahkan state untuk role
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // Fungsi untuk login
  const login = (userData) => {
    setUser(userData);
    setRole(userData.role); // Simpan role dari userData
    setLastInteraction(Date.now());
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role); // Simpan role ke localStorage
  };

  // Fungsi untuk login sebagai guest
  const loginAsGuest = () => {
    const guestData = {
      username: 'Tamu',
      token: 'guest-token',
      role: 'guest',
    };
    setUser(guestData);
    setRole('guest');
    setLastInteraction(Date.now());
    localStorage.setItem('token', 'guest-token');
    localStorage.setItem('role', 'guest');
  };

  // Fungsi untuk logout
  const logout = () => {
    setUser(null);
    setRole(null); // Reset role saat logout
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Hapus role dari localStorage
  };

  // Cek session timeout setiap 1 menit
  useEffect(() => {
    const checkSession = setInterval(() => {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteraction;

      // Jika lebih dari 30 menit, logout
      if (timeSinceLastInteraction > 30 * 60 * 1000) {
        logout();
      }
    }, 60 * 1000); // Cek setiap 1 menit

    return () => clearInterval(checkSession); // Bersihkan interval saat komponen unmount
  }, [lastInteraction]);

  // Update waktu terakhir interaksi
  const updateLastInteraction = () => {
    setLastInteraction(Date.now());
  };

  // Cek token dan role saat komponen pertama kali di-mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUser({ token });
      setRole(role);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, login, loginAsGuest, logout, updateLastInteraction }}>
      {children}
    </AuthContext.Provider>
  );
};