import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

class CarritosDaoArchivo extends ContenedorArchivo {

    constructor(rutadir) {
        super(`${rutadir}/carritos.txt`)
    }
}

export default CarritosDaoArchivo