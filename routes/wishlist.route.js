const express = require('express');
const app = express();
const router = express.Router();
// Wish List and Wish list item schema
let WishListSchema = require('../model/wishlist.model');
let WishListItemSchema = require('../model/wishlistitem.model');

// Routes
router.route('/create').post(async(req, res, next) => {
  try {
    const { name, user_id } = req.body;
    const wishlist = await WishListSchema.create({ name, user: user_id });
    res.json({status:true,code:201,data:wishlist})
  } catch (err) {
    console.log("error value is",err);
    res.status(500).json({ error: 'Failed to create wishlist' });
  }
});
/*Add items to the wish list*/
router.post('/:wishlistId/items', async (req, res) => {
  try {
    const { product_id } = req.body;
    const wishlistId = req.params.wishlistId;
    console.log("product_id, wishlist and  wishlist id value is",product_id,wishlistId)
    const wishlistItem = await WishListItemSchema.create({ product_id, wishlist: wishlistId });
    const wishlistResp = await WishListSchema.findByIdAndUpdate(wishlistId, { $push: { items: wishlistItem._id } });
    res.json({status:true,code:200,data:wishlistItem})
  } catch (err) {
    console.log("error is",err);
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
});

router.get('/:wishlistId', async (req, res) => {
  try {
    const wishlistId = req.params.wishlistId;
    const wishlist = await WishListSchema.find().populate({path:"items",populate:{ path: 'product_id'}});
    res.json(wishlist);
  } catch (err) {
    console.log("error is",err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

module.exports = router;
