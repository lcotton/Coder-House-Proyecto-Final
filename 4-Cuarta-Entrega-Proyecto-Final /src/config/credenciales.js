import dotenv from "dotenv";

dotenv.config({ path: "./src/config/.env" });

const credenciales = {
  MONGO_ATLAS_USER: process.env.MONGO_ATLAS_USER || "coderhouse",
  MONGO_ATLAS_PASSWORD: process.env.MONGO_ATLAS_PASSWORD || "coderhouse",
  MONGO_ATLAS_CLUSTER:
    process.env.MONGO_ATLAS_CLUSTER || "coderhouse.naatu.mongodb.net",
  MONGO_ATLAS_DBNAME: process.env.MONGO_ATLAS_DBNAME || "ecommerce",
  SESSION_SECRET_KEY: process.env.SESSION_SECRET_KEY || "coderhouse",
  ADMIN_USER: process.env.ADMIN_USER || "",
  ADMIN_PASS: process.env.ADMIN_PASS || "",
  ACCOUNT_SID: process.env.ACCOUNT_SID || "",
  AUTH_TOKEN: process.env.AUTH_TOKEN || "",
  ADMIN_MOBILE_PHONE: "",
  NODE_ENV: process.env.NODE_ENV || "prod",
  OPCION_DATOS: process.env.OPCION_DATOS || "mongodb",

};

export { credenciales };
