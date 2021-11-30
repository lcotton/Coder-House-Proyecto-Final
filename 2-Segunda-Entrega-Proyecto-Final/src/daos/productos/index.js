import { PERS } from "../../config.js";
import config from "../../config.js"

let productosDao;

switch (PERS) {
  case "mongodb":
    const { default: ProductosDaoMongoDb } = await import(
      "./ProductosDaoMongoDb.js"
    );
    productosDao = new ProductosDaoMongoDb();
    break;
  case "firebase":
    const { default: ProductosDaoFirebase } = await import(
      "./ProductosDaoFirebase.js"
    );
    productosDao = new ProductosDaoFirebase();
    break;
  case "fileSystem":
    const { default: ProductosDaoArchivo } = await import(
      "./ProductosDaoArchivo.js"
    );
    productosDao = new ProductosDaoArchivo(config.fileSystem.path);
    break;
}

export { productosDao };
