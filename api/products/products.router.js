const express = require('express')
const router = express.Router()
const ProductManager = require('../../dao/productManagerDB.js')
const { getSocketIO } = require('../../src/utils.js')

const productManager = new ProductManager("")

router.get("/products", async (req, res) => { 
    /*let consultas = req.query
    const result = await productManager.getProducts()
    if(result.status === "success"){
        if (Object.keys(consultas).length !== 0) {            
            let elementosMostrar =  result.payload.slice(0, consultas.limit)            
            res.status(200)
            res.render("home", { data: elementosMostrar} )
        } else {
            res.status(200)
            res.render("home", { data: result.payload})
        }
    } else {
        res.status(404).json(result.payload)
    }*/
    const result = await productManager.getProducts()

    if(result.status === "success"){
        res.status(200)
        res.render("home", { data: result.payload} )
    } else {
        res.status(404).json(result.payload)
    }
})

router.get("/products/:pid", async (req, res) => {
    //const productoId = parseInt(req.params.pid)    
    const productoId = req.params.pid    
    
    const result = await productManager.getProductById(productoId)
    
    if(result.status === "success"){
        res.status(200).json(result.payload)
    } else {
        res.status(200).json(result.error)
    }
})

router.post("/products", async (req, res) => {
    const nuevoProducto = {
        ...req.body
    }    
    const respuesta = await productManager.addProduct(nuevoProducto)
    if(respuesta.status === "success"){        
        res.status(201).json(respuesta.payload)
    } else {
        res.status(404).json(respuesta.error)
    }    
})

router.put("/products/:pid", async (req, res) => {
    //const productoId = parseInt(req.params.pid)
    const productoId = req.params.pid

    const respuesta = await productManager.editProduct(productoId, req.body)

    if(respuesta.status === "success"){
        res.status(200).json(respuesta.payload)
    } else {
        res.status(404).json(respuesta.error)
    }    
})

router.delete("/products/:pid", async (req, res) => {
    //const productoId = parseInt(req.params.pid)
    const productoId = req.params.pid

    const respuesta = await productManager.deleteProduct(productoId)
    
    if(respuesta.status === "success"){        
        res.status(200).json(respuesta.payload)
    } else {
        res.status(404).json(respuesta.error)
    }
})

router.get("/realtimeproducts", async (req, res) => { 
    /*let consultas = req.query
    const respuesta = await productManager.getProducts()
    if(respuesta.status === "success"){
        if (Object.keys(consultas).length !== 0) {            
            let elementosMostrar =  respuesta.payload.slice(0, consultas.limit)            
            res.status(200)
            res.render("realTimeProducts", { data: elementosMostrar} )
        } else {
            res.status(200)
            res.render("realTimeProducts", { data: respuesta.payload})
        }
    } else {
        res.status(404).json(respuesta.payload)
    }*/
    const respuesta = await productManager.getProducts()
    
    if(respuesta.status === "success"){
        res.status(200)
        res.render("realTimeProducts", { data: respuesta.payload} )
    } else {
        res.status(404).json(respuesta.payload)
    }
})

router.post("/realtimeproducts", async (req, res) => {
    const nuevoProducto = {
        ...req.body
    }    
    const respuesta = await productManager.addProduct(nuevoProducto)    
    if(respuesta.status === "success"){        
        const io = getSocketIO()        
        io.emit('update-products', respuesta.payload)
        res.status(201)
    } else {
        res.status(404).json(respuesta.error)
    }    
})

router.delete("/realtimeproducts/:pid", async (req, res) => {
    //const productoId = parseInt(req.params.pid)
    const productoId = req.params.pid
    const respuesta = await productManager.deleteProduct(productoId)
    if (respuesta.status === "success") {
        const io = getSocketIO()
        io.emit('remove-product', productoId)
        res.status(200)
    } else {
        res.status(404).json(respuesta.error)
    }
})

module.exports = router