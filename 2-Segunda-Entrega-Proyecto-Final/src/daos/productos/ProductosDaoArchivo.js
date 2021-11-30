import ContenedorArchivo from "../../contenedores/ContenedorArchivo.js"

class ProductosDaoArchivo extends ContenedorArchivo {

    constructor(rutadir) {
        super(`${rutadir}/productos.txt`)
    }
}

export default ProductosDaoArchivo