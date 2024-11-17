// controllers/carController.js
const Car = require("../models/Car");
const cloudinary = require("../config/cloudinary");

exports.createCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = req.files;

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path);
        return result.secure_url;
      })
    );

    const car = new Car({
      title,
      description,
      images: imageUrls,
      tags: JSON.parse(tags),
      userId: req.user._id,
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCars = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { userId: req.user._id };

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { "tags.car_type": { $regex: search, $options: "i" } },
          { "tags.company": { $regex: search, $options: "i" } },
          { "tags.dealer": { $regex: search, $options: "i" } },
        ],
      };
    }

    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCar = async (req, res) => {
  try {
    const car = await Car.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const updates = { title, description, tags: JSON.parse(tags) };

    if (req.files && req.files.length > 0) {
      const imageUrls = await Promise.all(
        req.files.map(async (image) => {
          const result = await cloudinary.uploader.upload(image.path);
          return result.secure_url;
        })
      );
      updates.images = imageUrls;
    }

    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Delete images from Cloudinary
    await Promise.all(
      car.images.map(async (imageUrl) => {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      })
    );

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
