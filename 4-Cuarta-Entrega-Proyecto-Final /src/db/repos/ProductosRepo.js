import { asDto, asModels, asDtos } from "../mappers/ProductoMappers.js";
import ProductosDaoFactory from "../../db/daos/productos/index.js";
import logger from "../../utils/logger.js";

export default class ProductosRepo {
  static instancia;
  constructor() {
    if (!ProductosRepo.instancia) {
      logger.info("ProductosRepo primera vez");
      this.dao = ProductosDaoFactory.getDao();
      ProductosRepo.instancia = this;
    } else {
      logger.info("ProductosRepo otras veces");
      return ProductosRepo.instancia;
    }
  }

  async listarAllProductos() {
    let dtos = await this.dao.listarAllProductos();
    const productos = asModels(dtos);
    dtos = asDtos(productos);
    return dtos;
  }

  async listarProducto(idProducto) {
    let dtos = await this.dao.listarProducto(idProducto);
    if (dtos.length > 1) {
      const productos = asModels(dtos);
      dtos = asDtos(productos);
      return dtos;
    } else {
      return dtos;
    }
  }

  async nuevoProducto(productoNuevo) {
    const dto = asDto(productoNuevo);
    return await this.dao.nuevoProducto(dto);
  }

  async actualizar(productoActualizado, idProducto) {
    return await this.dao.actualizar(productoActualizado, idProducto);
  }

  async borrar(idProducto) {
    return await this.dao.borrar(idProducto);
  }
}
