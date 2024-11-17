// src/App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { Navbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CarsList } from "./pages/CarsList";
import { CarForm } from "./pages/CarForm";
import { CarDetails } from "./pages/CarDetails";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/cars"
              element={
                <PrivateRoute>
                  <CarsList />
                </PrivateRoute>
              }
            />
            <Route
              path="/cars/new"
              element={
                <PrivateRoute>
                  <CarForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/cars/:id"
              element={
                <PrivateRoute>
                  <CarDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/cars/:id/edit"
              element={
                <PrivateRoute>
                  <CarForm />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/cars" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
