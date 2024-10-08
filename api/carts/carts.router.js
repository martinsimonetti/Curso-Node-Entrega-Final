const express = require('express')
const router = express.Router()
//const CartManager = require('../../dao/cartManagerFS.js')
const CartManager = require('../../dao/cartManagerDB.js')

const cartManager = new CartManager()

router.post("/carts", async (req, res) => {
    const respuesta = await cartManager.createCart()
    if(respuesta.status === "success"){
        res.status(201).json(respuesta.payload)
    } else {
        res.status(404).json(respuesta.error)
    }    
})

/*router.get("/carts", async (req, res) => {
    const respuesta = await cartManager.getCarts()
    if(respuesta.status === "success"){
        res.status(200).json(respuesta.payload)        
    } else {
        res.status(404).json(respuesta.payload)
    }
})*/

router.get("/carts/:cid", async (req, res) => {
    //const carritoId = parseInt(req.params.cid)
    const carritoId = req.params.cid

    const result = await cartManager.getCartById(carritoId)
    
    if(result.status === "success"){
        const plainProducts = result.payload.products.map(item => ({
            title: item.product.title,
            description: item.product.description,
            code: item.product.code,
            price: item.product.price,
            stock: item.product.stock,
            category: item.product.category,
            quantity: item.quantity
        }))
        res.status(200).render("cart", { payload: plainProducts })
    } else {
        res.status(200).json(result.error)
    }
})

router.post("/carts/:cid/product/:pid", async (req, res) => {    
    /*const carritoId = parseInt(req.params.cid)
    const productoId = parseInt(req.params.pid)*/

    const carritoId = req.params.cid
    const productoId = req.params.pid
    
    const result = await cartManager.addProductInCart(carritoId, productoId)
    
    if(result.status === "success"){        
        res.status(201).json(result.payload)        
    } else {
        res.status(404).json(result.error)
    }
})

router.delete("/carts/:cid/products/:pid", async (req, res) => {
    const carritoId = req.params.cid
    const productoId = req.params.pid

    const result = await cartManager.deleteProductCart(carritoId, productoId)
    if(result.status === "success"){
        res.status(201).json(result.payload)
    } else {
        res.status(404).json(result.error)
    }
})

router.put("/carts/:cid", async (req,res) => {
    const carritoId = req.params.cid
    const productos = req.body

    const result = await cartManager.addManyProductsCart(carritoId, productos)
    if(result.status === "success"){
        res.status(201).json(result.payload)
    } else {
        res.status(404).json(result.error)
    }
})

router.put("/carts/:cid/products/:pid", async (req, res) => {
    const carritoId = req.params.cid
    const productoId = req.params.pid
    const cantidad = req.body.quantity

    const result = await cartManager.updateQuantity(carritoId, productoId, cantidad)
    if(result.status === "success"){
        res.status(201).json(result.payload)
    } else {
        res.status(404).json(result.error)
    }
})

router.delete("/carts/:cid", async (req,res) => {
    const carritoId = req.params.cid

    const result = await cartManager.deleteProductsCart(carritoId)
    if(result.status === "success"){
        res.status(201).json(result.payload)
    } else {
        res.status(404).json(result.error)
    }
})

module.exports = router