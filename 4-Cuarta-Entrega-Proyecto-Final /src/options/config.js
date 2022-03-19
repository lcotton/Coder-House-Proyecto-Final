import { credenciales } from "../config/credenciales.js";

export default {
  OPCION_DATOS: credenciales.OPCION_DATOS,
  NODE_ENV: credenciales.NODE_ENV,
  mongodb_atlas: {
    cnxStr: `mongodb+srv://${credenciales.MONGO_ATLAS_USER}:${credenciales.MONGO_ATLAS_PASSWORD}@${credenciales.MONGO_ATLAS_CLUSTER}/${credenciales.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    },
  },
  mongodb_local: {
    cnxStr: "mongodb://localhost:27017/ecommerce",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    },
  },
};
