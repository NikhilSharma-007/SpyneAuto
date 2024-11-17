// src/pages/CarForm.js
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { carService } from "../services/carService";
import { useAuth } from "../context/AuthContext";

export const CarForm = () => {
  const { id } = useParams(); // If there's an ID, we're editing an existing car
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [], // Images to upload
    tags: {
      car_type: "",
      company: "",
      dealer: "",
    },
    existingImages: [], // Existing images for edit mode
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id); // Loading state for fetching existing car data
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current user for userId association

  // Fetch car details when editing
  useEffect(() => {
    if (id) {
      const fetchCarDetails = async () => {
        try {
          const car = await carService.getCar(id);
          // Populate the form with the existing car data
          setFormData({
            title: car.title || "",
            description: car.description || "",
            images: [], // Clear for new uploads
            tags: {
              car_type: car.tags.car_type || "",
              company: car.tags.company || "",
              dealer: car.tags.dealer || "",
            },
            existingImages: car.images || [], // Populate existing images
          });
        } catch (err) {
          setError("Failed to fetch car details.");
        } finally {
          setIsFetching(false);
        }
      };

      fetchCarDetails();
    }
  }, [id]);

  // Handle input changes for title, description, and tags
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle tag changes separately
  const handleTagChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      tags: {
        ...prevData.tags,
        [name]: value,
      },
    }));
  };

  // Handle image selection (this converts the FileList into an array)
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      images: selectedFiles,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Form data validation (you can add more validation as needed)
    if (!formData.title || !formData.description) {
      setError("Please fill in the required fields.");
      setIsLoading(false);
      return;
    }

    try {
      if (!id) {
        // Create new car
        await carService.createCar(formData);
      } else {
        // Update existing car
        await carService.updateCar(id, formData);
      }
      navigate("/cars"); // Redirect to car list after successful creation/updating
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save car");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle the loading state while fetching existing car data
  if (isFetching) {
    return <div>Loading car details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {id ? "Edit Car" : "Add New Car"}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Upload New Images (optional, up to 10)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full"
          />
          <p className="text-gray-500 text-sm">
            If you don't upload new images, the existing images will remain.
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Existing Images
          </label>
          <div className="grid grid-cols-2 gap-2">
            {formData.existingImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Existing Car Image ${index + 1}`}
                className="w-full h-auto object-cover rounded"
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Car Type
          </label>
          <input
            type="text"
            name="car_type"
            value={formData.tags.car_type}
            onChange={handleTagChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.tags.company}
            onChange={handleTagChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Dealer
          </label>
          <input
            type="text"
            name="dealer"
            value={formData.tags.dealer}
            onChange={handleTagChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-600 text-white p-3 rounded ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Saving..." : id ? "Edit Car" : "Add Car"}
        </button>
      </form>
    </div>
  );
};
