// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const config = require("./config/config");

//validate env
const validateEnv = require("./config/validateEnv");
validateEnv();

// Import routes
const authRoutes = require("./routes/auth");
const carRoutes = require("./routes/cars");

// Create Express app
const app = express();

// Middleware
const corsOptions = {
  origin: ["http://localhost:3000", "https://car-management-wi9t.onrender.com"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.send("Car Management API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
