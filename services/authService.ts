import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import sendMail from "./nodemailer";
const User = require("../models/user/userModel");

export const registerUser = async (
  email: string,
  password: string,
  role: string,
  otp: string
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  if (password.length < 6)
    throw new Error("Password must be at least 6 characters long");

  if (!email.match(/\S+@\S+\.\S+/))
    throw new Error("Please enter a valid email");

  if (!["user", "admin"].includes(role))
    throw new Error("Role must be either 'user' or 'admin'");

  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user object
  const newUser = new User({
    email,
    password: hashedPassword,
    role,
    otp: otp, // Store OTP in the user record
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000), // OTP expiry time (5 minutes)
  });

  // Send OTP email to user
  await sendMail({
    to: email,
    subject: "Travel Booking Registration OTP",
    otp: otp,
  });

  // Save the user in the database
  await newUser.save();

  return {
    message:
      "User registered successfully. Please verify OTP to complete the registration.",
  };
};

export const loginUser = async (
  email: string,
  password: string,
  role: string
) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (user.role !== role) throw new Error("Invalid role");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  return { token };
};
