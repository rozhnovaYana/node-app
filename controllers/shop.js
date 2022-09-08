const { ObjectID } = require("bson");

const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err => console.log(err))
};

exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch(err => console.log(err))
};
exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
  .then(product => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products"
    })
  })
  .catch(err => console.log(err))
}
exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user.addToCart(productId)
  .then(results => {
    res.redirect("/cart")
  })
  .catch(err => console.log(err))
}
exports.getCart = (req, res, next) => {
  req.user.populate("cart.items.productID")
  .then(user => {
    return res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      prods: user.cart.items
    });
  })
  .catch(err => console.log(err))
};

exports.deleteProductFromCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user.deleteProductFromCart(productId)
  .then(data => {
    res.redirect("/cart")
  })
  .catch(err => console.log(err))
}
exports.postOrders = (req, res, next) => {
  req.user.populate("cart.items.productID")
  .then(user => {
    console.log(user.cart.items)
    const products = user.cart.items.map(product => {
      return ({
        product: {...product.productID._doc},
        quantity: product.quantity
    })});
    const order = new Order({
      items: products,
      user: {
        name: user.name,
        userId: user._id
      }
    });
    order.save();
    return user
  })
  .then(user => {
    user.cart = {items: []}
    return user.save()
  })
  .then(() => {
    res.redirect("/orders")
  })
};

exports.getOrders = (req, res, next) => {
  Order.find({"user.userId": req.user._id})
  .then(orders => {
    res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: orders
  });
  })
};


