const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let wishlistSchema = new Schema({
    name: {
        type: String,
        required: true,
        select: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'UserSchema',
        required: true,
    },
    items: [{ type: Schema.Types.ObjectId, ref: 'WishListItemSchema' }]
}, {
    timestamps: true,
    collection: 'wishlists'
})

module.exports = mongoose.model('WishListSchema', wishlistSchema)
