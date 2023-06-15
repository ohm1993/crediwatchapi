let express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    dbConfig = require('./db/database');

// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true
}).then(() => {
        console.log('Database connected')
    },
    error => {
        console.log('Database could not be connected : ' + error)
    }
)
// Setting up express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
// Api root
const userRoute = require('./routes/user.route')
const productRoute = require('./routes/product.route')
const wishlistRoute = require('./routes/wishlist.route')
const orderRoute = require('./routes/order.routes')
app.use('/user', userRoute)
app.use('/product', productRoute)
app.use('/wishlist',wishlistRoute)
app.use('/order',orderRoute)

// Create port
const port = process.env.PORT || 8000;
// Conectting port
const server = app.listen(port, () => {
    console.log('Port connected to: ' + port)
})
// Index Route
app.get('/', (req, res) => {
    res.send('invaild endpoint');
});
// error handler
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});
