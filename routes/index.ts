import express from "express";
import authRouter from "./authRoute";
const router = express.Router();

// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=<[{(Common Routes)}]>=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

router.use("/auth", authRouter);

export default router;
