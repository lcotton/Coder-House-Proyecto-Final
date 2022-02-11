import ContenedorMongoDb from "../../contenedores/ContenedorMongoDb.js";

class CarritosDaoMongoDb extends ContenedorMongoDb {
  constructor() {
    super("carritos", {
      id: { type: Number, required: true },
      timestamp: { type: Date, required: true },
      productos: { type: Array, required: true },
    });
  }
}

export default CarritosDaoMongoDb;
