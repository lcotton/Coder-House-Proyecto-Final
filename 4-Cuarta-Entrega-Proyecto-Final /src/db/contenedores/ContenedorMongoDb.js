import mongoose from "mongoose";
import config from "../../options/config.js";
import logger from "../../utils/logger.js";

class ContenedorMongoDb {
  constructor(nombreColeccion, esquema) {
    this.coleccion = mongoose.model(nombreColeccion, esquema);
  }

  async init() {
    if (config.NODE_ENV === "prod") {
      await mongoose.connect(
        config.mongodb_atlas.cnxStr,
        config.mongodb_atlas.options
      );
      logger.info("dao en mongodb atlas -> listo");
    }
    if (config.NODE_ENV === "dev") {
      await mongoose.connect(
        config.mongodb_local.cnxStr,
        config.mongodb_local.options
      );
      logger.info("dao en mongodb local -> listo");
    }
  }

  async listarAllProductos() {
    try {
      const objetos = await this.coleccion.find({}, { __v: 0 });
      return objetos;
    } catch (error) {
      logger.error(`Error en operación de base de datos ${error}`);
    }
  }

  async listarProducto(id) {
    try {
      const buscado = await this.coleccion.find({ id: id }, { __v: 0 });
      if (buscado.length === 0) {
        return { error: "producto no encontrado" };
      } else {
        return buscado;
      }
    } catch (error) {
      logger.error(`Error en operación de base de datos ${error}`);
    }
  }

  async listarCarritosProductos(id, email) {
    try {
      const buscado = await this.coleccion.find(
        { id: id, email: email },
        { productos: 1, _id: 0 }
      );
      if (buscado.length === 0) {
        return { error: "carrito no encontrado" };
      } else {
        return buscado;
      }
    } catch (error) {
      logger.error(`Error en operación de base de datos ${error}`);
    }
  }

  async nuevoProducto(nuevoElem) {
    const objetos = await this.coleccion.find({});
    let newId;
    if (objetos.length === 0) {
      newId = 1;
    } else {
      const objetoIdMax = await this.coleccion
        .find({}, { id: 1, _id: 0 })
        .limit(1)
        .sort({ id: -1 });
      newId = objetoIdMax[0].id + 1;
    }

    const timestamp = Date.now();
    const newObj = { ...nuevoElem, id: newId, timestamp: timestamp };

    try {
      await this.coleccion.create(newObj);
      return newId;
    } catch (error) {
      logger.error(`Error en operación de base de datos ${error}`);
    }
  }

  async nuevoCarrito(productos, email) {
    const objetos = await this.coleccion.find({});
    let newId;
    if (objetos.length === 0) {
      newId = 1;
    } else {
      const objetoIdMax = await this.coleccion
        .find({}, { id: 1, _id: 0 })
        .limit(1)
        .sort({ id: -1 });
      newId = objetoIdMax[0].id + 1;
    }

    const timestamp = Date.now();
    const newObj = {
      ...productos,
      id: newId,
      timestamp: timestamp,
      email: email,
    };

    try {
      await this.coleccion.create(newObj);
      return newId;
    } catch (error) {
      logger.error(`Error en operación de base de datos ${error}`);
    }
  }

  async guardarProductoCarrito(nuevoElem, idElem, email) {
    const buscado = await this.coleccion.find({ id: idElem, email: email });
    let updateElem;
    if (buscado.length === 0) {
      return { error: "carrito no encontrado" };
    } else {
      updateElem = { ...nuevoElem };
    }
    try {
      await this.coleccion.updateOne(
        { id: idElem },
        { $push: { productos: updateElem } }
      );
      return { id_carrito_producto_agregado: idElem };
    } catch (error) {
      logger.error(`Error en operación de base de datos ${error}`);
    }
  }

  async vaciarCarritosProductos(idElem, email) {
    const buscado = await this.coleccion.find({ id: idElem, email: email });
    if (buscado.length === 0) {
      return { error: "carrito no encontrado" };
    } else {
      try {
        return await this.coleccion.updateOne(
          { id: idElem },
          { $set: { productos: [] } }
        );
      } catch (error) {
        logger.error(`Error en operación de base de datos ${error}`);
      }
    }
  }

  async actualizar(nuevoElem, idElem) {
    const buscado = await this.coleccion.find({ id: idElem });
    let updateElem;
    if (buscado.length === 0) {
      return { error: "producto no encontrado" };
    } else {
      updateElem = { ...nuevoElem };
    }

    try {
      await this.coleccion.updateOne({ id: idElem }, { $set: updateElem });
      return { id_producto_actualizado: idElem };
    } catch (error) {
      logger.error(`Error en operación de base de datos ${error}`);
    }
  }

  async borrar(id) {
    const buscado = await this.coleccion.find({ id: id });
    if (buscado.length === 0) {
      return { error: "elemento no encontrado" };
    }
    try {
      await this.coleccion.deleteMany({ id: id });
      return { id_borrado: id };
    } catch (error) {
      logger.error(`Error en operación de base de datos ${error}`);
    }
  }
  async borrarProductoCarrito(idCarrito, idProducto, email) {
    const buscado = await this.coleccion.find({
      id: idCarrito,
      email: email,
    });
    if (buscado.length === 0) {
      return {
        error: "carrito no encontrado",
      };
    }
    try {
      const index = buscado[0].productos.findIndex((p) => p.id == idProducto);
      if (index != -1) {
        buscado[0].productos.splice(index, 1);
        buscado[0].save();
        return {
          id_carrito: idCarrito,
          id_producto_eliminado: idProducto,
        };
      } else {
        return {
          error: "no se encuentra el producto en el carrito especificado",
        };
      }
    } catch (error) {
      logger.error(`Error en operación de base de datos ${error}`);
    }
  }
}

export default ContenedorMongoDb;
