const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(([rows, filedData]) => {
    res.render('shop/product-list', {
      prods: rows,
      pageTitle: 'All Products',
      path: '/products'
    });
  })
  .catch((err) => {console.log(err)});
};
exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.getProductById(id)
  .then(([product]) => {
    res.render("shop/product-detail", {
      product: product[0],
      pageTitle: product.title,
      path: "/products"
    })
  })
  .catch(err => console.log(err))
  
}
exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.getProductById(productId, product => {
    Cart.addToCart(productId, product.price)
  })
  res.redirect("/")
}

exports.deleteProductFromCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.getProductById(productId, product => {
    Cart.deleteProductById(productId, product.price);
    res.redirect("/cart")
  })
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
  .then(([rows, filedData]) => {
    res.render('shop/index', {
      prods: rows,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch((err) => {console.log(err)});
};

exports.getCart = (req, res, next) => {
  Cart.getProducts(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      products.forEach(product => {
        const cartProduct = cart.products.find(item => item.id === product.id)
        if(cartProduct) {
          cartProducts.push({product, qty: cartProduct.qty})
        }
      });
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        prods: cartProducts,
        price: cart.totalPrice
      });
    })
  })
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
