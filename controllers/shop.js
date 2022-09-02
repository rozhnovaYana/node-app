const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  Product.findAll()
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
  Product.findAll()
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
  Product.findByPk(id)
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
  let quantity = 1;
  let fetchedCart;

  req.user.getCart()
  .then(cart => {
    fetchedCart = cart
    return cart.getProducts({where: {id: productId}})
  })
  .then(products => {
    if(products.length > 0){
      quantity = products[0].cartItem.quantity + 1;
      return products[0];
    }
    else{
      return Product.findByPk(productId)
    }
  })
  .then(product => {
    fetchedCart.addProduct(product, {through: {quantity}})
  })
  .then(() => {
    res.redirect("/cart")
  })
  // Product.getProductById(productId, product => {
  //   Cart.addToCart(productId, product.price)
  // })
}

exports.deleteProductFromCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where: { id: productId}})
  })
  .then(products => {
    const product = products[0];
    return product.cartItem.destroy()
  })
  .then(data => {
    res.redirect("/cart")
  })
  .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    cart.getProducts()
    .then(products => {
      return res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        prods: products,
        price: cart.totalPrice
      });
    })
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
  let fetchedCart;
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart
    return cart.getProducts()
  })
  .then(products => {
    return req.user.createOrder()
    .then(order => {
      order.addProducts(products.map(item => {
        item.orderItem = {quantity: item.cartItem.quantity};
        return item
      }))
    })
  })
  .then(data => {
    fetchedCart.setProducts(null)
  })
  .then(() => {
    res.redirect("/orders")
  })
};
