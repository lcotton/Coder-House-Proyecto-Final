import { asDto, asModels, asDtos } from "../mappers/CarritoMappers.js";
import CarritosDaoFactory from "../../db/daos/carritos/index.js";
import logger from "../../utils/logger.js";

export default class CarritosRepo {
  static instancia;
  constructor() {
    if (!CarritosRepo.instancia) {
      logger.info("CarritosRepo primera vez");
      this.dao = CarritosDaoFactory.getDao();
      CarritosRepo.instancia = this;
    } else {
      logger.info("CarritosRepo otras veces");
      return CarritosRepo.instancia;
    }
  }

  async listarCarritosProductos(idCarrito, email) {
    let dtos = await this.dao.listarCarritosProductos(idCarrito, email);
    if (dtos.length > 1) {
      const carritos = asModels(dtos);
      dtos = asDtos(carritos);
      return dtos;
    } else {
      return dtos;
    }
  }

  async nuevoCarrito(carritoNuevo, email) {
    const dto = asDto(carritoNuevo);
    return await this.dao.nuevoCarrito(dto, email);
  }

  async guardarProductoCarrito(productoNuevo, idCarrito, email) {
    return await this.dao.guardarProductoCarrito(
      productoNuevo,
      idCarrito,
      email
    );
  }

  async borrarProductoCarrito(idCarrito, idProducto, email) {
    return await this.dao.borrarProductoCarrito(idCarrito, idProducto, email);
  }

  async vaciarCarritosProductos(idCarrito, email) {
    return await this.dao.vaciarCarritosProductos(idCarrito, email);
  }
}
