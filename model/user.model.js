const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
let userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    wishlist:{
      type: Schema.Types.ObjectId,
      ref: 'WishListSchema',
    }
}, {
    timestamps: true,
    collection: 'users'
})
/* It will delete the password any where we are returning the user */
userSchema.set('toJSON', {
    transform: function(doc, ret, opt) {
        delete ret['password']
        return ret
    }
})
//middleware to ensure password is encrypted before saving into the database
userSchema.pre('save', function(next) {
    var user = this;
    //if password is changed or modified then ignore the middleware
    if (!user.isModified('password'))
        return next();
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err); //exit if error is found
            console.log("hased value is", hash);
            user.password = hash;
            next();
        });
    });
});
//method to compare password in api
userSchema.methods.comparePassword = function(password) {
    console.log("compare password methods called",password, this.password, bcrypt.compareSync(password, this.password));
    return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('UserSchema', userSchema)
