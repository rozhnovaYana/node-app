const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.editProduct = (req, res, next) => {
  const editing = req.query.edit;
  Product.findByPk(req.params.productId)
  .then(product => {
    if(!product) {
      return res.redirect("/")
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editing,
      product
    });
  })
};

exports.saveEditedProduct = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.update({
    title, imageUrl, price, description
  }, {
    where: {id: id}
  })
  .then(result => {
    res.redirect("/admin/products")
  })
  .catch(err => console.log(err))
}

exports.deleteEditedProduct = (req, res, next) => {
  const productId = req.body.id;
  Product.destroy({ where: {id: productId}})
  .then(data => {
    res.redirect("/admin/products")
  })
  .catch(err => console.log(err))
  // Cart.deleteProductById(req.body.id, req.body.price)
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user.createProduct({
    title,
    imageUrl, 
    price,
    description
  })
  .then(result => {
    res.redirect("/admin/products")
  })
  .catch(err => console.log(err))
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => console.log(err))
};
