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
  Product.getProductById(req.params.productId, product => {
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
  const product = new Product(id, title, imageUrl, description, price);
  product.save();
  res.redirect("/admin/products")
}

exports.deleteEditedProduct = (req, res, next) => {
  const productId = req.body.id;
  Product.deleteProductById(productId);
  Cart.deleteProductById(req.body.id, req.body.price)
  res.redirect("/admin/products")
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save()
  .then(() => {
    res.redirect('/');
  })
  .catch(err => console.log(err))
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};
