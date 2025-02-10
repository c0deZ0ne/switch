import axios from "axios";

const API_BASE_URL = process.env.API_URL;
const api = axios.create({
  baseURL: "http://192.168.43.171:3001",
  
  headers: {
    "Content-Type": "application/json",
  },
  
});

// Optional: Add request interceptor (e.g., for authentication tokens)
api.interceptors.request.use(
  (config) => {
    // You can add an authentication token dynamically here
    const token = ""; // Replace with actual token logic
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor (e.g., handle errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
