import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser, getProfile } from '../apis/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await getProfile();
          if (res.success) {
            setUser(res.data);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Error auto-authenticating user:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res;
      } else {
        throw new Error(res.message || 'Login failed.');
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    setLoading(true);
    try {
      const res = await registerUser({ name, email, password, confirmPassword });
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res;
      } else {
        throw new Error(res.message || 'Registration failed.');
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
