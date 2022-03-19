export default class Carrito {
  #id;
  #timestamp;
  #email;
  #productos;

  constructor({ id, timestamp, productos }) {
    this.id = id;
    this.timestamp = timestamp;
    this.email = email;
    this.productos = productos;
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

  get email() {
    return this.#email;
  }

  set email(email) {
    if (!email) throw new Error('"email" es un campo requerido');
    this.#email = email;
  }

  get productos() {
    return this.#productos;
  }

  set productos(productos) {
    if (!productos) throw new Error('"productos" es un campo requerido');
    this.#productos = productos;
  }
}
