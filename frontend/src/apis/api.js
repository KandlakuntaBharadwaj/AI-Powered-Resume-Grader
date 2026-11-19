import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://ai-powered-resume-grader.onrender.com/api'
);

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register User
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Login User
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Profile Data
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Request password reset PIN
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reset password with PIN
export const resetPassword = async (email, token, newPassword, confirmPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      email,
      token,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Upload and analyze resume
export const uploadResume = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', file);
  if (jobDescription) {
    formData.append('jobDescription', jobDescription);
  }

  try {
    const response = await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Fetch resume analysis history
export const getHistory = async () => {
  try {
    const response = await api.get('/resume/history');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
