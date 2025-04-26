import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";

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

interface SendMailProps {
  to: string;
  subject: string;
  otp: any;
}

export const sendMail = async ({ to, otp, subject }: SendMailProps) => {
  try {
    const mailOptions = {
      from: "Codemyra1604@gmail.com",
      to: to,
      subject: subject,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
          <h2 style="text-align: center; color: #333;">Travel Booking - Verify Your Email</h2>
          <p style="font-size: 16px; color: #555;">
            Hi there,
          </p>
          <p style="font-size: 16px; color: #555;">
            Thank you for signing up! Please use the following OTP to verify your email address. This OTP is valid for 10 minutes.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 30px; letter-spacing: 8px; color: #4CAF50; font-weight: bold;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #999;">
            If you did not request this, please ignore this email.
          </p>
          <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
            &copy; ${new Date().getFullYear()} Travel Booking
          </p>
        </div>
      </div>
    `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Email sent successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error sending email",
      error: (error as Error).message,
    };
  }
};

export default sendMail;
