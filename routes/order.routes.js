const express = require('express');
const app = express();
const router = express.Router();
// Wish List and Wish list item schema
let WishListSchema = require('../model/wishlist.model');
let OrderSchema = require('../model/order.model');
let OrderItemSchema = require('../model/orderitem.model');

// Routes
router.route('/create').post(async(req, res, next) => {
  try {
    const { user_id, status, total_price } = req.body;
    const orderResp = await OrderSchema.create({ user_id, status, total_price });
    res.json({status:true,code:201,data:orderResp})
  } catch (err) {
    console.log("error value is",err);
    res.status(500).json({ error: 'Failed to create wishlist' });
  }
});
/*Add items to the wish list*/
router.post('/:orderId/items', async (req, res) => {
  try {
    const order_id = req.params.orderId;
    const { wishlist_id }  = req.body;
    const wishlists = await WishListSchema.findById(wishlist_id).populate({path:"items",populate:{ path: 'product_id'}});
    let OrderItems = [];
    let OrderItemsIds = [];
    for(let i = 0; i < wishlists.items.length; i++){
      OrderItems.push({order_id:order_id,product_id:wishlists.items[i].product_id._id,price:wishlists.items[i].product_id.price})
    }
    const orderItemsResp = await OrderItemSchema.insertMany(OrderItems);
    for(let j = 0; j < orderItemsResp.length; j++){
      OrderItemsIds.push(orderItemsResp[j]._id)
    }
    const wishlistResp = await OrderSchema.findByIdAndUpdate(order_id, { $push: { orderitems: OrderItemsIds }});
    res.json({status:true,code:201,data:orderItemsResp})
  } catch (err) {
    console.log("error is",err);
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderlist = await OrderSchema.find({user_id:userId}).populate({path:"orderitems",populate:{ path: 'product_id'}});
    res.json({status:true,code:200,data:orderlist})
  } catch (err) {
    console.log("error is",err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

module.exports = router;
