import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const uploadResume = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append('resume', file);
  if (jobDescription) {
    formData.append('jobDescription', jobDescription);
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/resume/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getHistory = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/resume/history`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
