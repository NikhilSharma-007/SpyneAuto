// src/pages/CarDetails.js
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { carService } from "../services/carService";

export const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const data = await carService.getCar(id);
        if (data) {
          setCar(data);
        } else {
          setError("Car not found");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
        setError("An error occurred while fetching car details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await carService.deleteCar(id);
        navigate("/cars"); // After deletion, redirect to car list
      } catch (error) {
        console.error("Error deleting car:", error);
        setError("An error occurred while deleting the car.");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{car.title}</h1>

      <div className="mb-4">
        <p className="text-gray-600">{car.description}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {car.images && car.images.length > 0 ? (
            car.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Car ${index + 1}`}
                className="w-full h-auto object-cover rounded"
              />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Tags</h3>
        <p>Car Type: {car.tags.car_type || "N/A"}</p>
        <p>Company: {car.tags.company || "N/A"}</p>
        <p>Dealer: {car.tags.dealer || "N/A"}</p>
      </div>

      <div className="flex gap-4">
        <Link
          to={`/cars/${car._id}/edit`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Car
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Car
        </button>
      </div>
    </div>
  );
};
