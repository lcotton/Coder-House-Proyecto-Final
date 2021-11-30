import { promises as fs } from "fs";

class ContenedorArchivo {
  constructor(ruta) {
    this.ruta = ruta;
  }

  async listarProducto(id) {
    let productos = await fs.readFile(this.ruta, "utf-8");
    productos = JSON.parse(productos);
    const idParam = parseInt(id);
    const productoBuscado = productos.filter((p) => p.id === idParam);

    if (productoBuscado.length === 0) {
      return { error: "producto no encontrado" };
    } else {
      return productoBuscado;
    }
  }

  async listarAllProductos() {
    try {
      const objs = await fs.readFile(this.ruta, "utf-8");
      return JSON.parse(objs);
    } catch (error) {
      return [];
    }
  }

  async listarCarritosProductos(id) {
    let carritos = await fs.readFile(this.ruta, "utf-8");
    carritos = JSON.parse(carritos);
    const idParam = parseInt(id);
    const carritoBuscado = carritos.filter((p) => p.id === idParam);

    if (carritoBuscado.length === 0) {
      return { error: "carrito no encontrado" };
    } else {
      return carritoBuscado[0].productos;
    }
  }

  async guardar(nuevoElem) {
    let productos = await fs.readFile(this.ruta, "utf-8");
    productos = JSON.parse(productos);
    let content;
    let newId;

    if (productos.length === 0) {
      newId = 1;
      productos.push(nuevoElem);
      productos[0].id = newId;
      productos[0].timestamp = Date.now();
      content = JSON.stringify(productos);
    } else {
      const idMax = productos.reduce(
        (max, p) => (p.id > max ? p.id : max),
        productos[0].id
      );
      const index = productos.length;
      productos.push(nuevoElem);
      newId = idMax + 1;
      productos[index].id = newId;
      productos[index].timestamp = Date.now();
      content = JSON.stringify(productos);
    }
    try {
      await fs.writeFile(this.ruta, content);
      return newId;
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async guardarProductoCarrito(nuevoElem, idElem) {
    let carritos = await fs.readFile(this.ruta, "utf-8");
    carritos = JSON.parse(carritos);
    const idParam = parseInt(idElem);
    const carritoBuscado = carritos.filter((p) => p.id === idParam);
    if (carritoBuscado.length === 0) {
      return { error: "carrito no encontrado" };
    } else {
      try {
        const index = carritos.findIndex((p) => p.id === idParam);
        carritos[index].productos.push(nuevoElem);
        let content = JSON.stringify(carritos);
        content = await fs.writeFile(this.ruta, content);
        return { id_carrito_producto_agregado: idElem };
      } catch (error) {
        console.log(`Error en operación de base de datos ${error}`);
      }
    }
  }

  async actualizar(nuevoElem, idElem) {
    const id = parseInt(idElem);
    let productos = await fs.readFile(this.ruta, "utf-8");
    productos = JSON.parse(productos);
    const { nombre, descripcion, codigo, foto, precio, stock } = nuevoElem;
    const productoBuscado = productos.filter((p) => p.id === id);
    let content;

    if (productoBuscado.length === 0) {
      return { error: "producto no encontrado" };
    } else {
      const index = productos.findIndex((p) => p.id === id);
      productos[index].nombre = nombre;
      productos[index].descripcion = descripcion;
      productos[index].codigo = codigo;
      productos[index].foto = foto;
      productos[index].precio = precio;
      productos[index].stock = stock;
      content = JSON.stringify(productos);
    }
    try {
      await fs.writeFile(this.ruta, content);
      return { id_producto_actualizado: id };
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async borrar(id) {
    const idParam = parseInt(id);
    let productos = await fs.readFile(this.ruta, "utf-8");
    productos = JSON.parse(productos);
    const productoBuscado = productos.filter((p) => p.id === idParam);

    if (productoBuscado.length === 0) {
      return { error: "producto no encontrado" };
    } else {
      const index = productos.findIndex((p) => p.id === idParam);
      productos.splice(index, 1);
      let content = JSON.stringify(productos);
      try {
        await fs.writeFile(this.ruta, content);
        return { id_borrado: idParam };
      } catch (error) {
        throw new Error(`Error al guardar: ${error}`);
      }
    }
  }

  async borrarProductoCarrito(idCarrito, idProducto) {
    let carritos = await fs.readFile(this.ruta, "utf-8");
    carritos = JSON.parse(carritos);
    const idParam = parseInt(idCarrito);
    const idProd = parseInt(idProducto);
    const carritoBuscado = carritos.filter((p) => p.id === idParam);
    if (carritoBuscado.length === 0) {
      return { error: "carrito no encontrado" };
    } else {
      const indexCarrito = carritos.findIndex((p) => p.id === idParam);
      const indexProducto = carritos[indexCarrito].productos.findIndex(
        (p) => p.id === idProd
      );
      if (indexProducto != -1) {
        try {
          carritos[indexCarrito].productos.splice(indexProducto, 1);
          let content = JSON.stringify(carritos);
          await fs.writeFile(this.ruta, content);
          return {
            id_carrito: idParam,
            id_producto_eliminado: idProd,
          };
        } catch (error) {
          throw new Error(`Error al guardar: ${error}`);
        }
      } else {
        return {
          error: "no se encuentra el producto en el carrito especificado",
        };
      }
    }
  }
}

export default ContenedorArchivo;
