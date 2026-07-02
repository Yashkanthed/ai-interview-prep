import React, { createContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  loginApi,
  registerApi,
  logoutApi,
  getProfileApi
} from '../api/authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, if an access token exists, try to fetch the current profile
  // to rehydrate auth state (e.g. after a page refresh).
  const bootstrapAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await getProfileApi();
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem('accessToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}!`);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await registerApi(payload);
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    toast.success('Account created successfully!');
    return data.user;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      // proceed with client-side logout regardless of server response
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      toast.success('Logged out');
    }
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
