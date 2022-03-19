export default class Producto {
  #nombre;
  #descripcion;
  #codigo;
  #foto;
  #precio;
  #stock;
  #id;
  #timestamp;

  constructor({
    nombre,
    descripcion,
    codigo,
    foto,
    precio,
    stock,
    id,
    timestamp,
  }) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.codigo = codigo;
    this.foto = foto;
    this.precio = precio;
    this.stock = stock;
    this.id = id;
    this.timestamp = timestamp;
  }

  get nombre() {
    return this.#nombre;
  }

  set nombre(nombre) {
    if (!nombre) throw new Error('"nombre" es un campo requerido');
    this.#nombre = nombre;
  }

  get descripcion() {
    return this.#descripcion;
  }

  set descripcion(descripcion) {
    if (!descripcion) throw new Error('"descripcion" es un campo requerido');
    this.#descripcion = descripcion;
  }

  get codigo() {
    return this.#codigo;
  }

  set codigo(codigo) {
    if (!codigo) throw new Error('"codigo" es un campo requerido');
    if (isNaN(codigo))
      throw new Error(
        '"codigo" es un campo de caracteres exclusivamente numéricos'
      );
    this.#codigo = codigo;
  }

  get foto() {
    return this.#foto;
  }

  set foto(foto) {
    if (!foto) throw new Error('"foto" es un campo requerido');
    this.#foto = foto;
  }

  get precio() {
    return this.#precio;
  }

  set precio(precio) {
    if (!precio) throw new Error('"precio" es un campo requerido');
    if (isNaN(precio))
      throw new Error(
        '"precio" es un campo de caracteres exclusivamente numéricos'
      );
    if (precio < 0) throw new Error('"precio" no puede ser negativo');
    this.#precio = precio;
  }

  get stock() {
    return this.#stock;
  }
  set stock(stock) {
    if (!stock) throw new Error('"stock" es un campo requerido');
    if (isNaN(stock))
      throw new Error(
        '"stock" es un campo de caracteres exclusivamente numéricos'
      );
    if (stock < 0) throw new Error('"stock" no puede ser negativo');
    this.#stock = stock;
  }

  get id() {
    return this.#id;
  }

  set id(id) {
    if (!id) throw new Error('"id" es un campo requerido');
    this.#id = id;
  }

  get timestamp() {
    return this.#timestamp;
  }

  set timestamp(timestamp) {
    if (!timestamp) throw new Error('"timestamp" es un campo requerido');
    this.#timestamp = timestamp;
  }
}
