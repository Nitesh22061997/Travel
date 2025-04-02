import express from "express";
import { login, logout, signup } from "../controllers/authController";
const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);
// router.post("/refresh");
// router.post("/forgot-password");
// router.post("/reset-password");
// router.post("/verify-email");
// router.post("/send-verification-email");
// router.post("/update-profile");
// router.post("/update-password");
// router.post("/delete-account");
// router.post("/get-user");
// router.post("/get-users");
// router.post("/get-user-by-id");
// router.post("/get-user-by-email");
// router.post("/get-user-by-username");
// router.post("/get-user-by-phone");

export default router;
