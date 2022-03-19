import Router from "express";
import CarritosRepo from "../db/repos/CarritosRepo.js";
import { whatsappCheckout, smsCheckout } from "../utils/twilio.js";
import { mailCheckout } from "../utils/transporter.js";
import passport from "../controller/auth.js";

const routerCarritos = Router();
const carritosRepo = new CarritosRepo();

routerCarritos.get(
  "/:id/productos",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const carritos = await carritosRepo.listarCarritosProductos(
      req.params.id,
      req.user.email
    );
    return res.json(carritos);
  }
);

routerCarritos.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const nuevoElemento = await carritosRepo.nuevoCarrito(
      req.body,
      req.user.email
    );
    return res.json({ id_asignado: nuevoElemento });
  }
);

routerCarritos.delete(
  "/:id/productos/:id_prod",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const borraElemento = await carritosRepo.borrarProductoCarrito(
      req.params.id,
      req.params.id_prod,
      req.user.email
    );
    return res.json(borraElemento);
  }
);

routerCarritos.post(
  "/:id/productos",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const nuevoElemento = await carritosRepo.guardarProductoCarrito(
      req.body,
      req.params.id,
      req.user.email
    );
    return res.json(nuevoElemento);
  }
);

routerCarritos.get(
  "/:id/checkout",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const carritos = await carritosRepo.listarCarritosProductos(
      req.params.id,
      req.user.email
    );
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

      await carritosRepo.vaciarCarritosProductos(req.params.id, req.user.email);

      return res.status(200).json({
        descripcion: "Su pedido ha sido recibido y se encuentra en proceso",
      });
    } else {
      return res.json({ error: "carrito no encontrado" });
    }
  }
);

export { routerCarritos };
