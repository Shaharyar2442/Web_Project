import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken } from '../api/axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await api.get('/auth/refresh');
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      const response = await api.post('/auth/login', { email, password, rememberMe });
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password, role = 'user') => {
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
