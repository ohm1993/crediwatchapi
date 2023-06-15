const express = require('express');
const app = express();
// Express route
const router = express.Router();
// User schema
let UserSchema = require('../model/user.model');
//api for registration
router.route('/register').post((req, res, next) => {
      if(req.body.name && req.body.email && req.body.password){
          UserSchema.create(req.body)
          .then((result) => {
            res.json({status:true,code:201,data:result})
          })
          .catch((err) => {
            res.json({status:false,code:500,message:err.message})
          })
      }else{
           res.json({status:false,code:400,message:"Bad Request"})
      }
});

// api for login
router.route('/login').post((req, res) => {
  if(req.body.email && req.body.password){
    UserSchema.findOne({ email: req.body.email }).then(async(user) => {
      const password_match = await user.comparePassword(req.body.password)
      if(password_match){
          var token = 'jjhddhjdhjhdj';
          res.json({
            status:true,
            code:200,
            data:user
          })
      }else{
          res.json({status:false,code:401,message:'Could not authenticate password'});
      }
    })
    .catch((err) => {
      res.json({status:false,code:500,message:err.message})
    })
  }else{
       res.json({status:false,code:400,message:"Bad Request"})
  }
})

module.exports = router;
