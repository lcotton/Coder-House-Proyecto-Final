import { credenciales } from "../config/credenciales.js";
import { createTransport } from "nodemailer";
import logger from "./logger.js";

const ADMIN_USER = `${credenciales.ADMIN_USER}`;
const ADMIN_PASS =  `${credenciales.ADMIN_PASS}`;

const transporter = createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: ADMIN_USER,
    pass: ADMIN_PASS,
  },
});

const mailSignUp = async (subjectMail, htmlMail) => {
  try {
    const info = await transporter.sendMail({
      from: "Admin Ecommerce App",
      to: ADMIN_USER,
      subject: subjectMail,
      html: htmlMail,
    });
    logger.info(info);
  } catch (error) {
    logger.info(error);
  }
};

const mailCheckout = async (subjectMail, textMail) => {
  try {
    const info = await transporter.sendMail({
      from: "Admin Ecommerce App",
      to: ADMIN_USER,
      subject: subjectMail,
      text: textMail,
    });
    logger.info(info);
  } catch (error) {
    logger.info(error);
  }
};

export { mailSignUp, mailCheckout };
