import Router from "express";
import { carritosDao } from "../daos/carritos/index.js";

const routerCarritos = Router();

routerCarritos.get("/:id/productos", async (req, res) => {
  const carritos = await carritosDao.listarCarritosProductos(req.params.id);
  return res.json(carritos);
});

routerCarritos.post("/", async (req, res) => {
  const nuevoElemento = await carritosDao.guardar(req.body);
  return res.json({ id_asignado: nuevoElemento });
});

routerCarritos.delete("/:id", async (req, res) => {
  const borraElemento = await carritosDao.borrar(req.params.id);
  res.json(borraElemento);
});

routerCarritos.delete("/:id/productos/:id_prod", async (req, res) => {
  const borraElemento = await carritosDao.borrarProductoCarrito(
    req.params.id,
    req.params.id_prod
  );
  return res.json(borraElemento);
});

routerCarritos.post("/:id/productos", async (req, res) => {
  const nuevoElemento = await carritosDao.guardarProductoCarrito(
    req.body,
    req.params.id
  );
  return res.json(nuevoElemento);
});

export { routerCarritos };
