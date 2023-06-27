const express = require('express');
const paginate = require('jw-paginate');
const app = express();
const router = express.Router();
// User schema
let ProductSchema = require('../model/product.model');
// Get products
router.route('/').get((req, res) => {
  ProductSchema.find().then((data) => {
         const page = parseInt(req.query.page) || 1;
         const pageSize = 6;
         const pager = paginate(data.length, page, pageSize);
         const  products = data.slice(pager.startIndex, pager.endIndex + 1);
         res.json({status:true,code:200,data:products,pager:pager})
  })
  .catch((err) => {
    res.json({status:false,code:500,message:err.message})
  })
})
// Create product
router.route('/').post((req, res, next) => {
  ProductSchema.create(req.body)
  .then((result) => {
    res.json({status:true,code:201,data:result})
  })
  .catch((err) => {
    res.json({status:false,code:500,message:err.message})
  })
});

module.exports = router;
