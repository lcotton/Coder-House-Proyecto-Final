import Router from "express";
import fs from "fs";

const routerCarritos = Router();

routerCarritos.get("/:id/productos", async (req, res) => {
  let carritos = await fs.promises.readFile("./archivos/carritos.txt", "utf-8");
  carritos = JSON.parse(carritos);
  const id = parseInt(req.params.id);
  const carritoBuscado = carritos.filter((p) => p.id === id);
  if (carritoBuscado.length === 0) {
    return res.json({ error: "carrito no encontrado" });
  } else {
    return res.json(carritoBuscado[0].productos);
  }
});

routerCarritos.post("/", async (req, res) => {
  let carritos = await fs.promises.readFile("./archivos/carritos.txt", "utf-8");
  carritos = JSON.parse(carritos);

  if (carritos.length === 0) {
    carritos.push(req.body);
    carritos[0].id = 1;
    carritos[0].timestamp = Date.now();
    let content = JSON.stringify(carritos);
    content = await fs.promises.writeFile("./archivos/carritos.txt", content);
    return res.json({ idAsignado: 1 });
  } else {
    const idMax = carritos.reduce(
      (max, p) => (p.id > max ? p.id : max),
      carritos[0].id
    );
    const index = carritos.length;
    carritos.push(req.body);
    const newId = idMax + 1;
    carritos[index].id = newId;
    carritos[index].timestamp = Date.now();
    let content = JSON.stringify(carritos);
    content = await fs.promises.writeFile("./archivos/carritos.txt", content);
    return res.json({ idAsignado: newId });
  }
});

routerCarritos.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  let carritos = await fs.promises.readFile("./archivos/carritos.txt", "utf-8");
  carritos = JSON.parse(carritos);
  const carritoBuscado = carritos.filter((p) => p.id === id);

  if (carritoBuscado.length === 0) {
    return res.json({ error: "carrito no encontrado" });
  } else {
    const index = carritos.findIndex((p) => p.id === id);
    const carritoBorrado = carritos.splice(index, 1);
    let content = JSON.stringify(carritos);
    content = await fs.promises.writeFile("./archivos/carritos.txt", content);
    return res.json({ idCarritoBorrado: id });
  }
});

routerCarritos.post("/:id/productos", async (req, res) => {
  let carritos = await fs.promises.readFile("./archivos/carritos.txt", "utf-8");
  carritos = JSON.parse(carritos);
  const id = parseInt(req.params.id);
  const carritoBuscado = carritos.filter((p) => p.id === id);

  if (carritoBuscado.length === 0) {
    return res.json({ error: "carrito no encontrado" });
  } else {
    const index = carritos.findIndex((p) => p.id === id);
    carritos[index].productos.push(req.body);
    let content = JSON.stringify(carritos);
    content = await fs.promises.writeFile("./archivos/carritos.txt", content);
    return res.json({ idCarritoProductoAgregado: id });
  }
});

routerCarritos.delete("/:id/productos/:id_prod", async (req, res) => {
  const id = parseInt(req.params.id);
  const idProd = parseInt(req.params.id_prod);
  let carritos = await fs.promises.readFile("./archivos/carritos.txt", "utf-8");
  carritos = JSON.parse(carritos);
  const carritoBuscado = carritos.filter((p) => p.id === id);

  if (carritoBuscado.length === 0) {
    return res.json({ error: "carrito no encontrado" });
  } else {
    const indexCarrito = carritos.findIndex((p) => p.id === id);
    const indexProducto = carritos[indexCarrito].productos.findIndex(
      (p) => p.id === idProd
    );
    if (indexProducto === -1) {
      return res.json({
        error: "no se encuentra el producto en el carrito especificado",
      });
    } else {
      const carritoProductoBorrado = carritos[indexCarrito].productos.splice(
        indexProducto,
        1
      );
      let content = JSON.stringify(carritos);
      content = await fs.promises.writeFile("./archivos/carritos.txt", content);
      return res.json({ idCarrito: id, idProductoBorrado: idProd });
    }
  }
});

export { routerCarritos };
