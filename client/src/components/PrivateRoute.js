// src/components/PrivateRoute.js
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can add a loader if needed
  }

  return user ? children : <Navigate to="/login" />;
};
