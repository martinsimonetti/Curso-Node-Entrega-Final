const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const productCollection = "Products"
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean },
    stock: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    thumbnails: { type: [String] }    
})

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema)

module.exports = productModel