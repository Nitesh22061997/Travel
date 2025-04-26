import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  //   logger: true,
  //   debug: true,
});

interface SendMailProps {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
}

export const sendMail = async ({
  to,
  subject,
  templateName,
  templateData,
}: SendMailProps) => {
  const templatePath = path.join(__dirname, "templates", `${templateName}.ejs`);

  // Render EJS template to HTML
  const html = await ejs.renderFile(templatePath, templateData);

  const mailOptions = {
    from: " <DEMOAPP@noreply.com>",
    to,
    subject,
    html,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};
