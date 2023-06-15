const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let orderItemSchema = new Schema({
  order_id:{
    type: Schema.Types.ObjectId,
    ref: 'OrderSchema',
    required: true
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'ProductSchema',
    required: true
  },
  price: {
    type: Number,
    required: true
  }
},
{
    timestamps: true,
    collection: 'orderitems'
});

module.exports = mongoose.model('OrderItemSchema', orderItemSchema)
