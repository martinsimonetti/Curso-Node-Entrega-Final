const fs = require('fs').promises

// Archivo que almacenarán en disco los productos
const archivoProductos = "./src/json/products.json"

class ProductManager {
    constructor (path){
        this.products = []
        this.path = path
    }

    async addProduct(producto){
        const productos = await this.getProducts()
        this.products = productos.payload        
        
        const productoAlmacenado = this.products.find((p) => p.code === producto.code)
        
        if (productoAlmacenado) {
            return {
                status: "failed",
                error: "El producto ya existe."
            }
        } else {
            if (!producto.title || !producto.description || !producto.code || !producto.price || !producto.stock || !producto.category) {
                return {
                    status: "failed",
                    error: "Debe completar todos los campos del producto."
                }                                
            } else {
                let maxId = 0

                this.products.forEach((p) => {
                    if( p.id > maxId){
                        maxId = p.id
                    }
                })
                
                try {
                    if(!producto.thumbnails){
                        producto.thumbnails = []
                    }
                    let nuevoProducto = {
                        id: maxId + 1,
                        status: true,
                        ...producto                                             
                    }

                    this.products.push(nuevoProducto) // Se agrega el producto a la lista de productos.
                    await fs.writeFile(archivoProductos, JSON.stringify(this.products, null, 2)) // Se crea el archivo "products.json" donde se guardan los productos.
                    return {
                        status: "success",
                        payload: nuevoProducto
                    }   
                } catch (error) {
                    return {
                        status: "failed",
                        error: error
                    }
                }                
            }
        }
    }

    async getProducts() {
        try {
            this.products = await fs.readFile(archivoProductos, "utf8") // Lee el archivo "products.json" donde se guardan los productos.            
            return {
                status: "success",
                payload: JSON.parse(this.products)
            }
        } catch (error) {
            return {
                status: "success",
                payload: []
            }
        }
    }

    async getProductById(productId){        
        const productos = await this.getProducts()
        this.products = productos.payload
        
        if (this.products == []) {
            return {
                status: "failed",
                error: "No se pudo encontrar el producto buscado. No hay productos en la lista."
            }  
        }
        
        const producto = this.products.find((p) => p.id === productId) // Busca el producto en la lista

        if (producto) {
            return {
                status: "success",
                payload: producto
            }
        } else {
            return {
                status: "failed",
                error: "No se pudo encontrar el producto buscado. Verifique el número de id."
            }  
        }
    }

    async editProduct(productId, prod){
        const product = await this.getProductById(productId) // Obtiene el producto por id.
        
        if (product.status === "success"){
            const producto = product.payload
            try {
                if (producto) {
                    Object.assign(producto, prod)
                    await fs.writeFile(archivoProductos, JSON.stringify(this.products, null, 2))  // Sobreescribe el archivo "products.json" donde se guardan los productos.
                    return {
                        status: "success",
                        payload: producto
                    }
                }
            } catch (error) {
                return {
                    status: "failed",
                    error: error
                }
            }
        } else {
            return {
                status: "failed",
                error: "No se pudo encontrar el producto a modificar. Verifique el número de id."
            }
        }        
    }

    async deleteProduct(productId){
        const product = await this.getProductById(productId) // Obtiene el producto por id.
        
        if (product.status === "success"){
            const producto = product.payload
            try {
                this.products = this.products.filter((p) => p.id !== producto.id) // Se saca el producto de la lista.
                await fs.writeFile(archivoProductos, JSON.stringify(this.products, null, 2))  // Sobreescribe el archivo "products.json" donde se guardan los productos.
                return {
                    status: "success",
                    payload: producto
                }
            } catch (error) {
                return {
                    status: "failed",
                    error: error
                }
            }
        } else {
            return {
                status: "failed",
                error: "No se pudo encontrar el producto a eliminar. Verifique el número de id."
            }
        }
    }
}

module.exports = ProductManager