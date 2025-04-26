import { sendMail } from "../services/nodemailer";

export const sendUserDetailsRoute = async (req: any, res: any) => {
  const { name, email, phone, address } = req.body;

  if (!name || !email || !phone || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await sendMail({
      to: email,
      subject: "Your Submitted Details",
      templateName: "userDetails",
      templateData: { name, email, phone, address },
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};
