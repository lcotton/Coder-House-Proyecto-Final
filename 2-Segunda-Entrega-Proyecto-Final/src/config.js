import fs from "fs";

export default {
  mongodb: {
    cnxStr:
      "mongodb+srv://coderhouse:coderhouse@coderhouse.naatu.mongodb.net/ecommerce?retryWrites=true&w=majority",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    },
  },
  firebase: {
    serviceAccount: JSON.parse(
      fs.readFileSync(
        "./src/db/coderhouse-d2bf0-firebase-adminsdk-ws07d-cfc6ab3a21.json",
        "utf8"
      )
    ),
  },
  fileSystem: {
    path: "./src/db/",
  },
};

export const PERS = "fileSystem";
