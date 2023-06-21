const express = require('express');
const app = express();
const router = express.Router();
// Wish List and Wish list item schema
let WishListSchema = require('../model/wishlist.model');
let WishListItemSchema = require('../model/wishlistitem.model');
let UserSchema = require('../model/user.model');

// Routes
router.route('/create').post(async(req, res, next) => {
  try {
    const { name, user_id } = req.body;
    let wishlist = await WishListSchema.findOne({ user: user_id}).exec();
    if(!wishlist){
       wishlist = await WishListSchema.create({ name, user: user_id });
    }
    await UserSchema.findByIdAndUpdate(user_id, { $set: { wishlist: wishlist._id }});
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
    const wishlist = await WishListSchema.findById(wishlistId).populate({path:"items",populate:{ path: 'product_id'}});
    res.json({status:true,code:200,data:wishlist})
  } catch (err) {
    console.log("error is",err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

router.delete('/:wishlistId/items/:itemId', async(req,res) => {
  try {
    const { wishlistId, itemId } = req.params;
    // Find the wishlist by ID
    const wishlist = await WishListSchema.findById(wishlistId);
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    // Check if the item exists in the wishlist
    const itemIndex = wishlist.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in the wishlist' });
    }
    // Remove the item from the wishlist
    wishlist.items.splice(itemIndex, 1);
    // Save the updated wishlist
    await wishlist.save();
    await WishListItemSchema.findByIdAndRemove(itemId)
    res.json({status:true,code:200,message: 'Item deleted successfully'})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})

/*Api to delete wishlist and their wishlist items*/
router.route('/:wishlistId').delete(async(req, res, next) => {
  try {
    const wishlistId = req.params.wishlistId;
    const wishlist = await WishListSchema.findById(wishlistId);
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    wishlist.items.splice(0, wishlist.items.length);
    await wishlist.save();
    await WishListItemSchema.deleteMany({ wishlist: wishlistId });
    res.json({status:true,code:200,message: 'Wish Lists deleted successfully'})
  } catch (err) {
    console.log("error value is",err);
    res.status(500).json({ error: 'Failed to create wishlist' });
  }
});

module.exports = router;
