const express = require('express');
const app = express();
const router = express.Router();
// Wish List and Wish list item schema
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
    const { product_id,price } = req.body;
    const order_id = req.params.orderId;
    const orderItem = await OrderItemSchema.create({ order_id, product_id, price });
    const wishlistResp = await OrderSchema.findByIdAndUpdate(order_id, { $push: { orderitems: orderItem._id }});
    res.json({status:true,code:201,data:orderItem})
  } catch (err) {
    console.log("error is",err);
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
});

router.get('/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderlist = await OrderSchema.find().populate({path:"orderitems",populate:{ path: 'product_id'}});
    res.json({status:true,code:200,data:orderlist})
  } catch (err) {
    console.log("error is",err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

module.exports = router;
