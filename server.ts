import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index";
import connectDB from "./config/db";
import mongoose from "mongoose";

process.on("SIGINT", () => {
  mongoose.connection
    .close()
    .then(() => {
      console.log(
        "warning",
        "Mongoose default connection disconnected through app termination"
      );
      process.exit(0);
    })
    .catch((err: any) => {
      console.log("error", "Mongoose default connection error: " + err);
    });
});

dotenv.config();

const PORT = process.env.PORT || 3000;

// Database connection
connectDB();

// Middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define root route before mounting router
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Mount router for other routes
app.use("/api", router); // Changed from "/" to "/api"

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
