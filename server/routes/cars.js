// routes/cars.js
const carController = require("../controllers/carController");
const auth = require("../middleware/auth");
const multer = require("multer");
const express = require("express");
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", auth, upload.array("images", 10), carController.createCar);
router.get("/", auth, carController.getCars);
router.get("/:id", auth, carController.getCar);
router.put("/:id", auth, upload.array("images", 10), carController.updateCar);
router.delete("/:id", auth, carController.deleteCar);

module.exports = router;
