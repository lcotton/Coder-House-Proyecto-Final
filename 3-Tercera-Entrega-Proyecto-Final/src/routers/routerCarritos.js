import Router from "express";
import { carritosDao } from "../daos/carritos/index.js";
import { whatsappCheckout, smsCheckout } from "../twilio.js";
import { mailCheckout } from "../transporter.js";

const routerCarritos = Router();

routerCarritos.get("/:id/productos", async (req, res) => {
  if (req.isAuthenticated()) {
    const carritos = await carritosDao.listarCarritosProductos(req.params.id);
    return res.json(carritos);
  } else {
    return res.status(401).json({
      error: "401",
      descripcion: `Usuario no autenticado. Inicie sesión`,
    });
  }
});

routerCarritos.post("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const nuevoElemento = await carritosDao.guardar(req.body);
    return res.json({ id_asignado: nuevoElemento });
  } else {
    return res.status(401).json({
      error: "401",
      descripcion: `Usuario no autenticado. Inicie sesión`,
    });
  }
});

routerCarritos.delete("/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const borraElemento = await carritosDao.borrar(req.params.id);
    res.json(borraElemento);
  } else {
    return res.status(401).json({
      error: "401",
      descripcion: `Usuario no autenticado. Inicie sesión`,
    });
  }
});

routerCarritos.delete("/:id/productos/:id_prod", async (req, res) => {
  if (req.isAuthenticated()) {
    const borraElemento = await carritosDao.borrarProductoCarrito(
      req.params.id,
      req.params.id_prod
    );
    return res.json(borraElemento);
  } else {
    return res.status(401).json({
      error: "401",
      descripcion: `Usuario no autenticado. Inicie sesión`,
    });
  }
});

routerCarritos.post("/:id/productos", async (req, res) => {
  if (req.isAuthenticated()) {
    const nuevoElemento = await carritosDao.guardarProductoCarrito(
      req.body,
      req.params.id
    );
    return res.json(nuevoElemento);
  } else {
    return res.status(401).json({
      error: "401",
      descripcion: `Usuario no autenticado. Inicie sesión`,
    });
  }
});

routerCarritos.get("/:id/checkout", async (req, res) => {
  if (req.isAuthenticated()) {
    const carritos = await carritosDao.listarCarritosProductos(req.params.id);
    if (carritos.length > 0) {
      const productos = carritos[0].productos.map(
        (producto) => producto.nombre
      );

      const mensajeWhatsapp = `nuevo pedido de ${req.user.nombre} ${req.user.email}. Detalle del pedido carrito ${req.params.id}: ${productos}`;
      const subject = `Nuevo Pedido de ${req.user.nombre} ${req.user.email}`;
      const text = `Detalle del pedido carrito ${req.params.id}: ${productos}`;
      const telefonoCliente = `${req.user.telefono}`;

      mailCheckout(subject, text);
      whatsappCheckout(mensajeWhatsapp);
      smsCheckout(telefonoCliente);

      return res.status(200).json({
        descripcion: "Su pedido ha sido recibido y se encuentra en proceso",
      });
    } else {
      return res.json({ error: "carrito no encontrado" });
    }
  } else {
    return res.status(401).json({
      error: "401",
      descripcion: `Usuario no autenticado. Inicie sesión`,
    });
  }
});

export { routerCarritos };
