import twilio from "twilio";
import logger from "./logger.js";

const ACCOUNT_SID = "ACf095edff9c56710092361c25963de6b8";
const AUTH_TOKEN = "3c3603df9aaeb45a4a2c4baa606323a2";
const ADMIN_MOBILE_PHONE = "+5491150492948";

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
