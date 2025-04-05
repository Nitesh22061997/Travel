import express from "express";
import authRouter from "./authRoute";
import visaRoute from "../routes/visaRoute";
const router = express.Router();

// +=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=<[{(Common Routes)}]>=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+

router.use("/auth", authRouter);
router.use("/visa", visaRoute);

export default router;
