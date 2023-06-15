const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    }
}, {
    timestamps: true,
    collection: 'products'
})
module.exports = mongoose.model('ProductSchema', productSchema)
