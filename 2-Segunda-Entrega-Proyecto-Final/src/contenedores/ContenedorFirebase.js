import admin from "firebase-admin";
import config from "../config.js";

admin.initializeApp({
  credential: admin.credential.cert(config.firebase.serviceAccount),
  databaseURL: "https://coderhouse-d2bf0.firebaseio.com",
});

const db = admin.firestore();

class ContenedorFirebase {
  constructor(nombreColeccion) {
    this.coleccion = db.collection(nombreColeccion);
  }

  async listarAllProductos() {
    try {
      let objetos = await this.coleccion.get();
      objetos = objetos.docs.map((d) => ({ id: d.id, ...d.data() }));
      return objetos;
    } catch (error) {
      console.log(`Error en operación de base de datos ${error}`);
    }
  }

  async listarProducto(id) {
    let idDoc = id;
    try {
      const doc = this.coleccion.doc(`${idDoc}`);
      const buscado = await doc.get();
      if (!buscado.data()) {
        return { error: "producto no encontrado" };
      } else {
        return buscado.data();
      }
    } catch (error) {
      console.log(`Error en operación de base de datos ${error}`);
    }
  }

  async listarCarritosProductos(id) {
    let idDoc = id;
    try {
      const doc = this.coleccion.doc(`${idDoc}`);
      const buscado = await doc.get();
      if (!buscado.data()) {
        return { error: "carrito no encontrado" };
      } else {
        return buscado.data().productos;
      }
    } catch (error) {
      console.log(`Error en operación de base de datos ${error}`);
    }
  }

  async guardar(nuevoElem) {
    let newId;
    let objetos = await this.coleccion.get();
    objetos = objetos.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (objetos.length === 0) {
      newId = 1;
    } else {
      const idMax = objetos.reduce(
        (max, p) => (p.id > max ? p.id : max),
        objetos[0].id
      );
      newId = parseInt(idMax) + 1;
    }

    const timestamp = Date.now();
    const newObj = { ...nuevoElem, timestamp: timestamp };

    try {
      let doc = this.coleccion.doc(`${newId}`);
      await doc.create(newObj);
      return newId;
    } catch (error) {
      console.log(`Error en operación de base de datos ${error}`);
    }
  }

  async guardarProductoCarrito(nuevoElem, idElem) {
    let idDoc = idElem;
    const doc = this.coleccion.doc(`${idDoc}`);
    const buscado = await doc.get();
    if (!buscado.data()) {
      return { error: "carrito no encontrado" };
    } else {
      try {
        let objetos = await this.coleccion.get();
        objetos = objetos.docs.map((d) => ({ id: d.id, ...d.data() }));
        const index = objetos.findIndex((o) => o.id === idDoc);
        objetos[index].productos.push(nuevoElem);
        await doc.update(objetos[index]);
        return { id_carrito_producto_agregado: idElem };
      } catch (error) {
        console.log(`Error en operación de base de datos ${error}`);
      }
    }
  }

  async actualizar(nuevoElem, idElem) {
    let idDoc = idElem;
    try {
      const doc = this.coleccion.doc(`${idDoc}`);
      const buscado = await doc.get();
      if (!buscado.data()) {
        return { error: "producto no encontrado" };
      } else {
        const updateObj = { ...nuevoElem };
        await doc.update(updateObj);
        return { id_producto_actualizado: parseInt(idElem) };
      }
    } catch (error) {
      console.log(`Error en operación de base de datos ${error}`);
    }
  }
  async borrar(id) {
    let idDoc = id;
    try {
      const doc = this.coleccion.doc(`${idDoc}`);
      const buscado = await doc.get();
      if (!buscado.data()) {
        return { error: "elemento no encontrado" };
      } else {
        await doc.delete();
        return { id_borrado: parseInt(id) };
      }
    } catch (error) {
      console.log(`Error en operación de base de datos ${error}`);
    }
  }
  async borrarProductoCarrito(idCarrito, idProducto) {
    let idDoc = idCarrito;
    const doc = this.coleccion.doc(`${idDoc}`);
    const buscado = await doc.get();
    if (!buscado.data()) {
      return { error: "carrito no encontrado" };
    }
    try {
      let objetos = await this.coleccion.get();
      objetos = objetos.docs.map((d) => ({ id: d.id, ...d.data() }));
      const indexCarrito = objetos.findIndex((o) => o.id === idDoc);
      const indexProducto = objetos[indexCarrito].productos.findIndex(
        (p) => parseInt(p.id) === parseInt(idProducto)
      );
      if (indexProducto != -1) {
        objetos[indexCarrito].productos.splice(indexProducto, 1);
        await doc.update(objetos[indexCarrito]);
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

export default ContenedorFirebase;
