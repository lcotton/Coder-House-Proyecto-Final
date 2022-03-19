import config from "../../../options/config.js";

let productosDao;

switch (config.OPCION_DATOS) {
  case "mongodb":
    const { default: ProductosDaoMongoDb } = await import(
      "./ProductosDaoMongoDb.js"
    );
    productosDao = new ProductosDaoMongoDb();
    await productosDao.init();
}

export default class ProductosDaoFactory {
  static getDao() {
    return productosDao;
  }
}
