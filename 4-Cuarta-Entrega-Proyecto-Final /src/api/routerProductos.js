import Router from "express";
import ProductosRepo from "../db/repos/ProductosRepo.js";
import passport from "../controller/auth.js";
import multer from "multer";
import * as mime from "mime-types";

let fileName = null;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    let ext = mime.extension(file.mimetype);
    let randomfileid = Date.now();
    fileName = `${randomfileid}.${ext}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage });

const routerProductos = Router();

const admin = "";
const productoRepo = new ProductosRepo();

routerProductos.get("/", async (req, res) => {
  const productos = await productoRepo.listarAllProductos();
  res.json(productos);
});

routerProductos.get("/:id", async (req, res) => {
  const producto = await productoRepo.listarProducto(req.params.id);
  res.json(producto);
});

routerProductos.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  //upload.single("myFile"),
  multer().none(),
  async (req, res) => {
    if (admin === req.user.email) {
      const nuevoElemento = await productoRepo.nuevoProducto(JSON.parse(req.body.data));
      res.json({ id_asignado: nuevoElemento });
    } else {
      return res.json({
        error: "-1",
        descripcion: `ruta '/api/productos' método ${req.method} no autorizada`,
      });
    }
  }
);

routerProductos.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (admin === req.user.email) {
      const actualizarElemento = await productoRepo.actualizar(
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
  }
);

routerProductos.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (admin === req.user.email) {
      const borraElemento = await productoRepo.borrar(req.params.id);
      return res.json(borraElemento);
    } else {
      return res.json({
        error: "-1",
        descripcion: `ruta '/api/productos/${req.params.id}' método ${req.method} no autorizada`,
      });
    }
  }
);

export { routerProductos };
