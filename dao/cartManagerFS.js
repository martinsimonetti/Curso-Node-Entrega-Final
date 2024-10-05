const fs = require('fs').promises
const ProductManager = require('./productManagerFS.js')

const productManager = new ProductManager("")

// Archivo que almacenarán en disco los productos
const archivoCarritos = "./src/json/carts.json"

class CartManager {
    constructor (){
        this.carts = []        
    }

    async createCart(){
        try {
            let nuevoCarrito = {
                id: this.carts.length + 1,
                products: []
            }

            this.carts.push(nuevoCarrito) // Se agrega el carrito a la lista de carritos.
            await fs.writeFile(archivoCarritos, JSON.stringify(this.carts, null, 2)) // Se crea el archivo "carts.json" donde se guardan los carritos.
            return {
                status: "success",
                payload: nuevoCarrito
            }   
        } catch (error) {
            return {
                status: "failed",
                error: error
            }
        }
    }

    async getCarts() {
        try {
            this.carts = await fs.readFile(archivoCarritos, "utf8") // Lee el archivo "carts.json" donde se guardan los carritos.            
            return {
                status: "success",
                payload: JSON.parse(this.carts)
            }
        } catch (error) {
            return {
                status: "success",
                payload: []
            }
        }
    }

    async getCartById(cartId){                
        const carritos = await this.getCarts()
        this.carts = carritos.payload
                
        const carrito = this.carts.find((c) => c.id === cartId) // Busca el carrito en la lista

        if (carrito) {
            return {
                status: "success",
                payload: carrito
            }
        } else {
            return {
                status: "failed",
                error: "No se pudo encontrar el carrito buscado. Verifique el número de id."
            }  
        }
    }

    async addProductInCart(cartId, productId){
        const cart = await this.getCartById(cartId)
        const product = await productManager.getProductById(productId)

        if (cart.status === "success" && product.status === "success"){
            const carrito = cart.payload            
            
            const productoAlmacenado = await carrito.products.find((p) => p.product === productId) //Verifica que el producto ya exista en el carrito.
            
            if(productoAlmacenado){
                productoAlmacenado.quantity += 1
            } else {
                const productoAgregar = {
                    product: productId,
                    quantity: 1
                }
                carrito.products.push(productoAgregar)
            }
            try {                
                await fs.writeFile(archivoCarritos, JSON.stringify(this.carts, null, 2)) // Se crea el archivo "carts.json" donde se guardan los carritos.
                
                return {
                    status: "success",
                    payload: carrito
                }
            } catch (error) {
                return {
                    status: "failed",
                    error: error
                }
            } 
        } else {
            if (cart.status === "failed") {
                return {
                    status: "failed",
                    error: cart.error
                }
            }
            return {
                status: "failed",
                error: product.error
            }            
        }
    }
}

module.exports = CartManager