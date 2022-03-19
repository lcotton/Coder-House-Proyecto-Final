import { credenciales } from "../config/credenciales.js";
import twilio from "twilio";
import logger from "./logger.js";

const ACCOUNT_SID = `${credenciales.ACCOUNT_SID}`;
const AUTH_TOKEN = `${credenciales.AUTH_TOKEN}`;
const ADMIN_MOBILE_PHONE = `${credenciales.ADMIN_MOBILE_PHONE}`;

const accountSid = ACCOUNT_SID;
const authToken = AUTH_TOKEN;

const client = twilio(accountSid, authToken);

const whatsappCheckout = async (mensaje) => {
  try {
    const message = await client.messages.create({
      body: mensaje,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${ADMIN_MOBILE_PHONE}`,
    });
    logger.info(message);
  } catch (error) {
    logger.info(error);
  }
};

const smsCheckout = async (telefonoCliente) => {
  try {
    const optionsSMS = await client.messages.create({
      body: "Su pedido ha sido recibido y se encuentra en proceso",
      from: "+18607925752",
      to: `${telefonoCliente}`,
    });
    logger.info(optionsSMS);
  } catch (error) {
    logger.info(error);
  }
};

export { whatsappCheckout, smsCheckout };
