import { PERS } from "../../config.js";
import config from "../../config.js";

let carritosDao;

switch (PERS) {
  case "mongodb":
    const { default: CarritosDaoMongoDb } = await import(
      "./CarritosDaoMongoDb.js"
    );
    carritosDao = new CarritosDaoMongoDb();
    break;
  case "firebase":
    const { default: CarritosDaoFirebase } = await import(
      "./CarritosDaoFirebase.js"
    );
    carritosDao = new CarritosDaoFirebase();
    break;
  case "fileSystem":
    const { default: CarritosDaoArchivo } = await import(
      "./CarritosDaoArchivo.js"
    );
    carritosDao = new CarritosDaoArchivo(config.fileSystem.path);
    break;
}

export { carritosDao };
