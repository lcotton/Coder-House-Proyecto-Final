import Router from "express";
import { productosDao } from "../daos/productos/index.js";

const routerProductos = Router();

const admin = true;

routerProductos.get("/", async (req, res) => {
  const productos = await productosDao.listarAllProductos();
  res.json(productos);
});

routerProductos.get("/:id", async (req, res) => {
  const producto = await productosDao.listarProducto(req.params.id);
  res.json(producto);
});

routerProductos.post("/", async (req, res) => {
  if (admin) {
    const nuevoElemento = await productosDao.guardar(req.body);
    res.json({ id_asignado: nuevoElemento });
  } else {
    return res.json({
      error: "-1",
      descripcion: `ruta '/api/productos' método ${req.method} no autorizada`,
    });
  }
});

routerProductos.put("/:id", async (req, res) => {
  if (admin) {
    const actualizarElemento = await productosDao.actualizar(
      req.body,
      req.params.id
    );
    return res.json(actualizarElemento);
  } else {
    return res.json({
      error: "-1",
      descripcion: `ruta '/api/productos/${req.params.id}' método ${req.method} no autorizada`,
    });
  }
});

routerProductos.delete("/:id", async (req, res) => {
  if (admin) {
    const borraElemento = await productosDao.borrar(req.params.id);
    return res.json(borraElemento);
  } else {
    return res.json({
      error: "-1",
      descripcion: `ruta '/api/productos/${req.params.id}' método ${req.method} no autorizada`,
    });
  }
});

export { routerProductos };
