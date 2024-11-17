// src/pages/CarsList.js
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { carService } from "../services/api";

export const CarsList = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, [search]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const data = await carService.getCars(search);
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await carService.deleteCar(id);
        setCars(cars.filter((car) => car._id !== id));
      } catch (error) {
        console.error("Error deleting car:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cars List</h1>
        <Link
          to="/cars/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Car
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search cars..."
          className="w-full p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div
              key={car._id}
              className="border rounded-lg overflow-hidden shadow-lg"
            >
              {car.images[0] && (
                <img
                  src={car.images[0]}
                  alt={car.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{car.title}</h3>
                <p className="text-gray-600 mb-4">{car.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(car.tags).map(
                    ([key, value]) =>
                      value && (
                        <span
                          key={key}
                          className="bg-gray-200 px-2 py-1 rounded text-sm"
                        >
                          {value}
                        </span>
                      )
                  )}
                </div>
                <div className="flex justify-between">
                  <Link
                    to={`/cars/${car._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDelete(car._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
