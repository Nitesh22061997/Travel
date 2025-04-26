import { Request, Response } from "express";
import TravelBooking from "../models/admin/travelBookingModel";
// Assuming the user model is in this path
import nodemailer from "nodemailer";
const User = require("../models/user/userModel");

export const createTravelBooking = async (req: any, res: any) => {
  try {
    const { email } = req.body;

    // Check if the user's status is active before proceeding
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.status !== "active") {
      return res.status(400).json({
        success: false,
        message:
          "Your account is inactive. Please verify your OTP to activate your account.",
      });
    }

    // Proceed with booking creation if status is active
    const booking = new TravelBooking(req.body);
    await booking.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "Codemyra1604@gmail.com",
        pass: `wpqp xsfk emdt qxkp`,
      },
    });

    const mailOptions = {
      from: "Travel Team ",
      to: [booking.email, "Codemyra1604@gmail.com"],
      subject: "Travel Booking Confirmation",
      html: `
        <h3>Hello ${booking.name},</h3>
        <p>Your travel to <strong>${
          booking.country_selected
        }</strong> has been successfully booked for <strong>${
        booking.number_of_days
      } days</strong>.</p>
        <ul>
          <li><strong>Travel Date:</strong> ${booking.date_of_travelling.toDateString()}</li>
          <li><strong>Travelers:</strong> ${
            booking.number_of_person
          } adults & ${booking.number_of_child} children</li>
          <li><strong>Total Price:</strong> ₹${booking.total_price}</li>
        </ul>
        <p>Thank you for choosing us!<br/>- Travel Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ success: true, message: "Booking created and email sent." });
  } catch (err: any) {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      message: "Error creating booking or sending email",
      error: err.message,
    });
  }
};
