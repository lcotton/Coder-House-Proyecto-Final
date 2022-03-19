import Producto from "../../db/models/productos.js";

export function asModel(datos) {
  const producto = new Producto(datos);
  return producto;
}

export function asModels(datos) {
  const productos = datos.map((d) => asModel(d));
  return productos;
}

export function asDto(producto) {
  const dto = {
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    codigo: producto.codigo,
    foto: producto.foto,
    precio: producto.precio,
    stock: producto.stock,
    id: producto.id,
    timestamp: producto.timestamp
  };
  return dto;
}

export function asDtos(productos) {
  const dtos = productos.map(d => asDto(d))
  return dtos
}
