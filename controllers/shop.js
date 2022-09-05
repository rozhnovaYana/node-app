const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
  Product.findProduct(id)
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

exports.deleteProductFromCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user.deleteFromCart(productId)
  .then(data => {
    res.redirect("/cart")
  })
  .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(products => {
    return res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      prods: products
    });
  })
  .catch(err => console.log(err))
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ["products"]})
  .then(orders => {
    res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    orders: orders
  });
  })
};

exports.postOrders = (req, res, next) => {
  req.user.addToOrders()
  .then(() => {
    res.redirect("/orders")
  })
};
