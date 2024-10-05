const mongoose = require('mongoose')

const cartCollection = "Carts"
const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: Number
            }
        ],
        default: []
    }
})

const cartModel = mongoose.model(cartCollection, cartSchema)

module.exports = cartModel