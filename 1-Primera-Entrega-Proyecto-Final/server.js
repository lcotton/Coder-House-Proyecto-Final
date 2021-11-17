import express from "express";
const app = express();
import { routerProductos } from "./router/routerProductos.js";
import { routerCarritos } from "./router/routerCarritos.js";

app.use(express.json());

app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarritos);

app.get("*", (req, res) => {
  next(error);
});

app.use(function (err, req, res, next) {
  res
    .status(500)
    .json({
      error: -2,
      descripcion: `ruta ${req.originalUrl} método ${req.method} no implementada`,
    });
});

const PORT = process.env.port || 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
