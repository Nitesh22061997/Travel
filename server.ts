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

const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/", router);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
