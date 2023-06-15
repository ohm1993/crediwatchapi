const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let wishlistItemSchema = new Schema({
  product_id: {
    type: Schema.Types.ObjectId,
    ref: 'ProductSchema',
    required: true
  },
  wishlist: {
    type: Schema.Types.ObjectId,
    ref: 'wishlists',
    required: true
  }
},
{
    timestamps: true,
    collection: 'wishlistitems'
});

module.exports = mongoose.model('WishListItemSchema', wishlistItemSchema)
