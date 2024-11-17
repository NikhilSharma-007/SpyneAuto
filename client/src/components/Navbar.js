// src/components/Navbar.js
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">
          SpyneAuto
        </Link>
        {user ? (
          <div className="flex items-center space-x-4">
            <Link to="/cars/new" className="text-white hover:text-gray-300">
              Add Car
            </Link>
            <button onClick={logout} className="text-white hover:text-gray-300">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-white hover:text-gray-300">
              Login
            </Link>
            <Link to="/register" className="text-white hover:text-gray-300">
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
