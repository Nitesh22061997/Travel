import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/authService";
import Visa from "../models/user/visaModel";
import { v4 as uuidv4 } from "uuid";
import sendMail from "../services/nodemailer";

const User = require("../models/user/userModel");

// Utility to generate a unique 4-digit OTP from UUID
const generateOtp = (): string => {
  const uuid = uuidv4().replace(/\D/g, ""); // Remove non-digits
  return uuid.slice(0, 4); // Take the first 4 digits
};

// User Registration
export const signup = async (req: any, res: any) => {
  try {
    const { email, password, role } = req.body;

    const otp = generateOtp();
    const result = await registerUser(email, password, role, otp);

    // Initially, set user status to 'inactive' after signup
    const user = await User.findOne({ email });
    if (user) {
      user.status = "inactive"; // Status is inactive until OTP is verified
      await user.save();
    }

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// User Login
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Only allow login if user status is 'active'
    if (user && user.status !== "active") {
      return res
        .status(400)
        .json({ message: "Account is inactive. Please verify OTP first." });
    }

    const result = await loginUser(email, password);
    res
      .status(200)
      .json({ result, message: "Login successful", role: user.role });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// User Logout
export const logout = async (req: any, res: any) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// OTP Verification
export const verifyOtp = async (req: any, res: any) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is already verified
    if (user.status === "active") {
      return res
        .status(400)
        .json({ message: "Your account is already active." });
    }

    if (!user.otp || !user.otpExpiry) {
      return res
        .status(400)
        .json({ message: "OTP not requested or already verified" });
    }

    if (user.otpExpiry < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update the status to 'active' after OTP is verified
    user.status = "active"; // User becomes active after OTP is verified
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully. Your account is now active.",
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Resend OTP
export const resendOtp = async (req: any, res: any) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // Ensure that OTP is only resent to inactive users
    if (user && user.status === "active") {
      return res
        .status(400)
        .json({ message: "Account is already active. No need to resend OTP." });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new OTP
    const otp = generateOtp();

    // Update OTP and expiry in the user document
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // Expiry in 5 mins
    await user.save();

    // Send the new OTP via email
    await sendMail({
      to: email,
      subject: "Travel Booking OTP Resend",
      otp: otp,
    });

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
