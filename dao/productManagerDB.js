const productModel = require('../dao/models/product.model.js')

// Archivo que almacenarán en disco los productos
const archivoProductos = "./src/json/products.json"

class ProductManager {
    constructor (path){
        this.products = []
        this.path = path
    }

    async addProduct(producto){
        /*const productos = await this.getProducts()
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
        }*/
        //await this.getProducts()

        //const productoAlmacenado = this.products.find((p) => p.code === producto.code)

        const productoAlmacenado = await productModel.findOne({ code: producto.code }).exec()
        
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
                try {
                    if(!producto.thumbnails){
                        producto.thumbnails = []
                    }
                    let nuevoProducto = {
                        status: true,
                        ...producto                                             
                    }
                    
                    const result = await productModel.create(nuevoProducto)
                    
                    return {
                        status: "success",
                        payload: result
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
        /*try {
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
        }*/
        try {
            const result = await productModel.find().lean()

            return {
                status: "success",
                payload: result
            }
        } catch (error) {
            return {
                status: "success",
                payload: []
            }
        }        
    }

    async getProductsParams( limit, page, sort, query ) {        
        try {
            console.log(query)
            let options
            let result
            
            if (sort) {
                sort === 'asc' ? sort = 1 : sort = -1
                options = { page, limit, sort: { price: sort }, lean: true, customLabels: { docs: 'payload' } }
            } else {
                options = { page, limit, lean: true, customLabels: { docs: 'payload' } }
            }

            if (query){
                result = await productModel.paginate(
                    { category: query },
                    options
                )
            } else {
                result = await productModel.paginate(
                    { },
                    options
                )
            }
            console.log(query)

            if (result.hasPrevPage) {
                result.prevLink = `http://localhost:8080/products/?limit=${result.limit}&&page=${result.prevPage}`
                if (sort){
                    if(sort == 1){
                        result.prevLink += `&&sort=asc`
                    } else {
                        result.prevLink += `&&sort=desc`
                    }                    
                }
                if (query) result.prevLink += `&&query=${query}`
            } else {
                result.prevLink = ""
            }

            if (result.hasNextPage) {
                result.nextLink = `http://localhost:8080/products/?limit=${result.limit}&&page=${result.nextPage}`
                if (sort){
                    if(sort == 1){
                        result.nextLink += `&&sort=asc`
                    } else {
                        result.nextLink += `&&sort=desc`
                    }                    
                }
                if (query) result.nextLink += `&&query=${query}`
            } else {
                result.nextLink = ""
            }

            console.log(result.prevLink)
            console.log(result.nextLink)
            

            result.isValid = !(page <= 0 || page > result.totalPages)
            result.status = "success"
            
            return result
        
        } catch (error) {
            console.log(error)
            return {
                status: "error",
                payload: []
            }
        }        
    }

    async getProductById(productId){        
        /*const productos = await this.getProducts()
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
        }*/

        try {
            const producto = await productModel.findById({ _id: productId})
            
            if(!producto){
                return {
                    status: "failed",
                    error: "No se pudo encontrar el producto buscado. Verifique el número de id."
                }
            }
            return {
                status: "success",
                payload: producto
            }
            
        } catch (error) {
            return {
                status: "failed",
                error: "No se pudo encontrar el producto buscado. Verifique el número de id."
            }
        }        
    }

    async editProduct(productId, prod){
        /*const product = await this.getProductById(productId) // Obtiene el producto por id.
        
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
        }*/
            try {
                if (!prod.title || !prod.description || !prod.code || !prod.price || !prod.stock || !prod.category) {
                    return {
                        status: "failed",
                        error: "Debe completar todos los campos del producto."
                    }                                
                } else {
                    const result = await productModel.updateOne({ _id: productId}, prod)

                    if (result.matchedCount != 1) {
                        return {
                            status: "failed",
                            error: "No se pudo encontrar el producto a modificar. Verifique el número de id."
                        }
                    }

                    return {
                        status: "success",
                        payload: result
                    }
                }
            } catch (error) {
                return {
                    status: "failed",
                    error: "No se pudo encontrar el producto a modificar. Verifique el número de id."
                }
            }
            
        
            /*if (product.status === "success"){
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
            }*/
    }

    async deleteProduct(productId){
        /*const product = await this.getProductById(productId) // Obtiene el producto por id.
        
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
        }*/
        try {
            const result = await productModel.deleteOne({ _id: productId})
            
            if (result.deletedCount === 0) {
                return {
                    status: "failed",
                    error: "No se pudo encontrar el producto a eliminar. Verifique el número de id."
                }
            }

            return {
                status: "success",
                payload: result
            }  
        } catch (error) {
            return {
                status: "failed",
                error: "No se pudo encontrar el producto a eliminar. Verifique el número de id."
            }
        }
    }
}

module.exports = ProductManager