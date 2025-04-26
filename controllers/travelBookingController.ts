// controllers/travelBooking.controller.ts
import { Request, Response } from "express";
import TravelBooking from "../models/admin/travelBookingModel";
import nodemailer from "nodemailer";

export const createTravelBooking = async (req: Request, res: Response) => {
  try {
    const booking = new TravelBooking(req.body);
    await booking.save();

    // Send confirmation email

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Correct SMTP server for Gmail
      port: 587, // Use port 587 for STARTTLS
      secure: false, // Use false to allow STARTTLS
      auth: {
        user: "Codemyra1604@gmail.com",
        pass: `wpqp xsfk emdt qxkp
`,
      },
      // logger: true,
      // debug: true, // Enable debug for more verbose logs
    });

    const mailOptions = {
      from: "Codemyra1604@gmail.com",
      to: booking.email,
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
    <li><strong>Travelers:</strong> ${booking.number_of_person} adults & ${
        booking.number_of_child
      } children</li>
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
