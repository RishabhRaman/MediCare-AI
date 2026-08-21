import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((authToken, authUser) => {
    if (authToken) {
      localStorage.setItem('token', authToken);
      setToken(authToken);
    }
    if (authUser) {
      localStorage.setItem('user', JSON.stringify(authUser));
      setUser(authUser);
    }
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      applySession(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Login failed.');
      return { success: false, message: err.message };
    }
  };

  const register = async (name, email, password, healthProfile) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, healthProfile });
      applySession(res.data.token, res.data.user);
      toast.success(`Welcome to MediCare AI, ${res.data.user.name}!`);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
      return { success: false, message: err.message };
    }
  };

  const demoLogin = async () => {
    try {
      const res = await api.post('/auth/demo');
      applySession(res.data.token, res.data.user);
      toast.success(`Logged in as Demo Patient: ${res.data.user.name}`);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Demo login failed.');
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
      toast.success('Successfully signed out.');
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('[Refresh User]', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        demoLogin,
        logout,
        updateUser,
        refreshUser,
        applySession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
