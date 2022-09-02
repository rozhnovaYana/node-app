const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
// import sequelize
const sequelize = require('./util/database');
// import models
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require("./models/order");
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user; 
        next()
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// relations

Product.belongsTo(User, {  // user creates the product
    constraints: true,
    onDelete: "CASCADE" // if we delete the user => the product will be deleted too
});
User.hasMany(Product); // can be replaced by belongsTo
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
User.hasMany(Order);
Order.belongsTo(User);
Order.belongsToMany(Product, {through: OrderItem})
Product.belongsToMany(Order, {through: OrderItem})

sequelize
// .sync({force: true}) 
.sync()  //The sync method has a look at all the models you defined and it then basically creates tables for them.
.then(result => {
    return User.findByPk(1)
})
.then(user => {
    if(!user){
        return User.create({
            name: "Yana", email: "yana@test.com" 
        })
    }
    return user
})
.then(user => {
    user.getCart()
    .then(cart => {
        if(!cart){
            return user.createCart()
        }
        return cart;
    })
})
.then(user => {
    app.listen(3000);
})
.catch(err => {
    console.log(err)
})

