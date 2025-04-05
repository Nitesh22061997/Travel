import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../services/cloudinary"; // ✅ Import configured Cloudinary

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const allowedFormats = ["png", "jpeg", "jpg"]; // Allowed formats
    const fileFormat = file.mimetype.split("/")[1]; // Extract format from MIME type

    return {
      folder: "visa_images",
      format: allowedFormats.includes(fileFormat) ? fileFormat : "png", // Default to PNG if unsupported
      public_id: `${
        file.originalname.replace(/\s+/g, "_").split(".")[0]
      }_${Date.now()}`, // Unique public ID
    };
  },
});

// Set up Multer middleware
const upload = multer({ storage });

export default upload; // ✅ Export Multer middleware
