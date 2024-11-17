// server/config/validateEnv.js

const validateEnv = () => {
  const required = [
    "MONGODB_URI",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  for (const item of required) {
    if (!process.env[item]) {
      console.error(`Environment variable ${item} is missing`);
      process.exit(1);
    }
  }
};

module.exports = validateEnv;
