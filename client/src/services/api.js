// src/services/api.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Add request interceptor for handling tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, logout user
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication Service
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post(`${API_URL}/auth/login`, credentials);

      // Ensure token is correctly stored
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        // Optional: Store user info
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } else {
        throw new Error("No token received");
      }

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post(`${API_URL}/auth/signup`, userData);

      // Ensure token is correctly stored
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        // Optional: Store user info
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      } else {
        throw new Error("No token received");
      }

      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
};

export const carService = {
  // Create a new car
  createCar: async (carData) => {
    const response = await api.post(`${API_URL}/cars`, carData);
    return response.data;
  },

  // Get all cars
  getCars: async (search = "") => {
    const response = await api.get(
      `${API_URL}/cars${search ? `?search=${search}` : ""}`
    );
    return response.data;
  },

  // Get single car
  getCar: async (id) => {
    const response = await api.get(`${API_URL}/cars/${id}`);
    return response.data;
  },

  // Update car
  updateCar: async (id, carData) => {
    const formData = new FormData();
    Object.keys(carData).forEach((key) => {
      if (key === "images") {
        carData.images.forEach((image) => {
          formData.append("images", image);
        });
      } else if (key === "tags") {
        formData.append("tags", JSON.stringify(carData.tags));
      } else {
        formData.append(key, carData[key]);
      }
    });
    const response = await api.put(`${API_URL}/cars/${id}`, formData);
    return response.data;
  },

  // Delete car
  deleteCar: async (id) => {
    await api.delete(`${API_URL}/cars/${id}`);
  },
};

export default api;
