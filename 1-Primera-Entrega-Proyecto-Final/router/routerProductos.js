import Router from "express";
import fs from "fs";

const routerProductos = Router();

const admin = true;

routerProductos.get("/", async (req, res) => {
  let productos = await fs.promises.readFile(
    "./archivos/productos.txt",
    "utf-8"
  );
  productos = JSON.parse(productos);
  res.json(productos);
});

routerProductos.get("/:id", async (req, res) => {
  let productos = await fs.promises.readFile(
    "./archivos/productos.txt",
    "utf-8"
  );
  productos = JSON.parse(productos);
  const id = parseInt(req.params.id);
  const productoBuscado = productos.filter((p) => p.id === id);

  if (productoBuscado.length === 0) {
    return res.json({ error: "producto no encontrado" });
  } else {
    return res.json(productoBuscado);
  }
});

routerProductos.post("/", async (req, res) => {
  if (admin) {
    let productos = await fs.promises.readFile(
      "./archivos/productos.txt",
      "utf-8"
    );
    productos = JSON.parse(productos);

    if (productos.length === 0) {
      productos.push(req.body);
      productos[0].id = 1;
      productos[0].timestamp = Date.now();
      let content = JSON.stringify(productos);
      content = await fs.promises.writeFile(
        "./archivos/productos.txt",
        content
      );
      return res.json({ idAsignado: 1 });
    } else {
      const idMax = productos.reduce(
        (max, p) => (p.id > max ? p.id : max),
        productos[0].id
      );
      const index = productos.length;
      productos.push(req.body);
      const newId = idMax + 1;
      productos[index].id = newId;
      productos[index].timestamp = Date.now();
      let content = JSON.stringify(productos);
      content = await fs.promises.writeFile(
        "./archivos/productos.txt",
        content
      );
      return res.json({ idAsignado: newId });
    }
  } else {
    return res.json({
      error: "-1",
      descripcion: `ruta '/api/productos' método ${req.method} no autorizada`,
    });
  }
});

routerProductos.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (admin) {
    let productos = await fs.promises.readFile(
      "./archivos/productos.txt",
      "utf-8"
    );
    productos = JSON.parse(productos);
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    const productoBuscado = productos.filter((p) => p.id === id);

    if (productoBuscado.length === 0) {
      return res.json({ error: "producto no encontrado" });
    } else {
      const index = productos.findIndex((p) => p.id === id);
      productos[index].nombre = nombre;
      productos[index].descripcion = descripcion;
      productos[index].codigo = codigo;
      productos[index].foto = foto;
      productos[index].precio = precio;
      productos[index].stock = stock;
      let content = JSON.stringify(productos);
      content = await fs.promises.writeFile(
        "./archivos/productos.txt",
        content
      );
      return res.json({ idProductoActualizado: id });
    }
  } else {
    return res.json({
      error: "-1",
      descripcion: `ruta '/api/productos/${id}' método ${req.method} no autorizada`,
    });
  }
});

routerProductos.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (admin) {
    let productos = await fs.promises.readFile(
      "./archivos/productos.txt",
      "utf-8"
    );
    productos = JSON.parse(productos);
    const productoBuscado = productos.filter((p) => p.id === id);

    if (productoBuscado.length === 0) {
      return res.json({ error: "producto no encontrado" });
    } else {
      const index = productos.findIndex((p) => p.id === id);
      const productoBorrado = productos.splice(index, 1);
      let content = JSON.stringify(productos);
      content = await fs.promises.writeFile(
        "./archivos/productos.txt",
        content
      );
      return res.json({ idProductoBorrado: id });
    }
  } else {
    return res.json({
      error: "-1",
      descripcion: `ruta '/api/productos/${id}' método ${req.method} no autorizada`,
    });
  }
});

export { routerProductos };
