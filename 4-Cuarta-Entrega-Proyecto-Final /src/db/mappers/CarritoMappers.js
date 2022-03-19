import Carrito from "../../db/models/carritos.js";

export function asModel(datos) {
  const producto = new Carrito(datos);
  return producto;
}

export function asModels(datos) {
  const productos = datos.map((d) => asModel(d));
  return productos;
}

export function asDto(carrito) {
  const dto = {
    id: carrito.id,
    timestamp: carrito.timestamp,
    email: carrito.email,
    productos: carrito.productos,
  };
  return dto;
}

export function asDtos(carritos) {
  const dtos = carritos.map((d) => asDto(d));
  return dtos;
}
