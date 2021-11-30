import mongoose from "mongoose";
import config from "../config.js";

await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options);

class ContenedorMongoDb {
  constructor(nombreColeccion, esquema) {
    this.coleccion = mongoose.model(nombreColeccion, esquema);
  }

  async listarAllProductos() {
    try {
      const objetos = await this.coleccion.find({}, { __v: 0 });
      return objetos;
    } catch (error) {
      console.log(`Error en operación de base de datos ${error}`);
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
      console.log(`Error en operación de base de datos ${error}`);
    }
  }

  async listarCarritosProductos(id) {
    try {
      const buscado = await this.coleccion.find(
        { id: id },
        { productos: 1, _id: 0 }
      );
      if (buscado.length === 0) {
        return { error: "carrito no encontrado" };
      } else {
        return buscado;
      }
    } catch (error) {
      console.log(`Error en operación de base de datos ${error}`);
    }
  }

  async guardar(nuevoElem) {
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
      console.log(`Error en operación de base de datos ${error}`);
    }
  }

  async guardarProductoCarrito(nuevoElem, idElem) {
    const buscado = await this.coleccion.find({ id: idElem });
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
      console.log(`Error en operación de base de datos ${error}`);
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
      console.log(`Error en operación de base de datos ${error}`);
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
      console.log(`Error en operación de base de datos ${error}`);
    }
  }
  async borrarProductoCarrito(idCarrito, idProducto) {
    const buscado = await this.coleccion.find({
      id: idCarrito,
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
      console.log(`Error en operación de base de datos ${error}`);
    }
  }
}

export default ContenedorMongoDb;
