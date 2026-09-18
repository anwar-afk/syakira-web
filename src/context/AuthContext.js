import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import { setUnauthorizedHandler } from '../api/apiClient';

export const AuthContext = createContext();

const GUEST_SESSION_KEY = 'guestSession';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const navigate = useNavigate();
  const navigatingRef = useRef(false);

  const clearGuestSession = () => {
    sessionStorage.removeItem(GUEST_SESSION_KEY);
  };

  const logout = useCallback((options = {}) => {
    const { redirectToLogin = false } = options;
    setUser(null);
    setRole(null);
    setIsGuest(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    clearGuestSession();

    if (redirectToLogin && !navigatingRef.current) {
      navigatingRef.current = true;
      navigate('/login', { replace: true });
      setTimeout(() => {
        navigatingRef.current = false;
      }, 0);
    }
  }, [navigate]);

  const login = useCallback((userData) => {
    clearGuestSession();
    setIsGuest(false);
    const nextUser = {
      id: userData.id,
      username: userData.username || userData.name || userData.email,
      email: userData.email,
      name: userData.name,
      token: userData.token,
      role: userData.role,
    };
    setUser(nextUser);
    setRole(userData.role);
    setLastInteraction(Date.now());
    localStorage.setItem('token', userData.token);
    if (userData.role) {
      localStorage.setItem('role', userData.role);
    }
  }, []);

  /**
   * Mode tamu: tanpa token Bearer palsu.
   * Hanya flag di sessionStorage + state memori.
   */
  const loginAsGuest = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    sessionStorage.setItem(GUEST_SESSION_KEY, '1');
    setUser({ username: 'Tamu', role: 'guest' });
    setRole('guest');
    setIsGuest(true);
    setLastInteraction(Date.now());
  }, []);

  const updateLastInteraction = useCallback(() => {
    setLastInteraction(Date.now());
  }, []);

  // Interceptor 401 → logout + redirect login jika di area admin
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setRole(null);
      setIsGuest(false);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      sessionStorage.removeItem(GUEST_SESSION_KEY);
      if (window.location.pathname.startsWith('/admin')) {
        navigate('/login', { replace: true });
      }
    });

    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  // Validasi session ke API saat mount (jangan percaya role di localStorage)
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      setAuthLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        if (sessionStorage.getItem(GUEST_SESSION_KEY) === '1') {
          if (!cancelled) {
            setUser({ username: 'Tamu', role: 'guest' });
            setRole('guest');
            setIsGuest(true);
          }
        }
        if (!cancelled) setAuthLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (cancelled) return;
        setUser({
          id: currentUser.id,
          username: currentUser.name || currentUser.email,
          email: currentUser.email,
          name: currentUser.name,
          token,
          role: currentUser.role,
        });
        setRole(currentUser.role);
        setIsGuest(false);
        localStorage.setItem('role', currentUser.role);
        sessionStorage.removeItem(GUEST_SESSION_KEY);
      } catch {
        if (cancelled) return;
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        setRole(null);
        setIsGuest(false);
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    };

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  // Session timeout idle 30 menit (hanya untuk user terautentikasi, bukan guest)
  useEffect(() => {
    if (!user || isGuest) return undefined;

    const checkSession = setInterval(() => {
      if (Date.now() - lastInteraction > 30 * 60 * 1000) {
        logout({ redirectToLogin: true });
      }
    }, 60 * 1000);

    return () => clearInterval(checkSession);
  }, [user, isGuest, lastInteraction, logout]);

  const isAuthenticated = Boolean(user && !isGuest && role);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isGuest,
        isAuthenticated,
        authLoading,
        login,
        loginAsGuest,
        logout,
        updateLastInteraction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
