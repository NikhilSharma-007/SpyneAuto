// src/services/carService.js
import api from "./api"; // Axios instance

export const carService = {
  createCar: async (carData) => {
    const formData = new FormData();

    // Append form data
    formData.append("title", carData.title);
    formData.append("description", carData.description);

    // Append new images to formData
    if (carData.images && carData.images.length > 0) {
      carData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    // Append tags as JSON string
    formData.append("tags", JSON.stringify(carData.tags));

    // Send POST request to create a new car
    const response = await api.post("/cars", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  updateCar: async (id, carData) => {
    const formData = new FormData();

    // Append form data
    formData.append("title", carData.title);
    formData.append("description", carData.description);

    // Append new images (if any) to formData
    if (carData.images && carData.images.length > 0) {
      carData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    // Append tags as JSON string
    formData.append("tags", JSON.stringify(carData.tags));

    // Send PUT request to update the car
    const response = await api.put(`/cars/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  deleteCar: async (id) => {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  },

  getCar: async (id) => {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  },
};
