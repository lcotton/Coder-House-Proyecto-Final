import config from "../../../options/config.js";

let carritosDao;

switch (config.OPCION_DATOS) {
  case "mongodb":
    const { default: CarritosDaoMongoDb } = await import(
      "./CarritosDaoMongoDb.js"
    );
    carritosDao = new CarritosDaoMongoDb();
    await carritosDao.init();

}

export default class CarritosDaoFactory {
  static getDao() {
    return carritosDao;
  }
}