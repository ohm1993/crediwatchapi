const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let orderSchema = new Schema({
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'UserSchema',
      required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE','CANCELED','DELIVERED'],
        required: true
    },
    orderitems: [{ type: Schema.Types.ObjectId, ref: 'OrderItemSchema' }],
    total_price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    collection: 'orders'
})
module.exports = mongoose.model('OrderSchema', orderSchema)
