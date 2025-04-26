import express from "express";

import {
  createVisa,
  getAllVisas,
  updateVisa,
  deleteVisa,
  hi,
} from "../controllers/visaController";
import upload from "../config/multer"; // Assuming you have a multer middleware for file uploads
import { sendUserDetailsRoute } from "../controllers/detailsMail";
import { createTravelBooking } from "../controllers/travelBookingController";
const router = express.Router();

router.post(
  "/create",
  upload.single("image"), // Use multer middleware for image upload
  createVisa
);
// router.post("/hi", hi);
router.get("/get", getAllVisas);
router.put(
  "/update/:country",
  upload.single("image"), // Use multer middleware for image upload
  updateVisa
);
router.delete("/delete/:country", deleteVisa);

router.post("/mail", sendUserDetailsRoute);

router.post("/book-travel", createTravelBooking);
export default router;

// Importing the Visa controller
