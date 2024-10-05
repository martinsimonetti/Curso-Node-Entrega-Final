const mongoose = require('mongoose')

const productCollection = "Products"
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String] },
})

const productModel = mongoose.model(productCollection, productSchema)

module.exports = productModel