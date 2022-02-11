import { PERS } from "../../config.js";

let carritosDao;

switch (PERS) {
  case "mongodb":
    const { default: CarritosDaoMongoDb } = await import(
      "./CarritosDaoMongoDb.js"
    );
    carritosDao = new CarritosDaoMongoDb();
    break;
}

export { carritosDao };
