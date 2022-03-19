import ContenedorMongoDb from "../../../db/contenedores/ContenedorMongoDb.js";

class ProductosDaoMongoDb extends ContenedorMongoDb {
  constructor() {
    super("productos", {
      nombre: { type: String, required: true },
      descripcion: { type: String, required: true },
      codigo: { type: Number, required: true },
      foto: { type: String, required: true },
      precio: { type: Number, required: true },
      stock: { type: Number, required: true },
      id: { type: Number, required: true },
      timestamp: { type: Date, required: true },
    });
  }
}

export default ProductosDaoMongoDb;
