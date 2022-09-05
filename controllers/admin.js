const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, imageUrl, description, null, req.user._id)
  product.save()
  .then(result => {
    res.redirect("/admin/products")
  })
  .catch(err => console.log(err))
};

exports.editProduct = (req, res, next) => {
  const editing = req.query.edit;
  Product.findProduct(req.params.productId)
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
  const product = new Product(title, price, imageUrl, description, id, req.user._id);
  product.save()
  .then(result => {
    res.redirect("/admin/products")
  })
  .catch(err => console.log(err))
}

exports.deleteEditedProduct = (req, res, next) => {
  const productId = req.body.id;
  Product.deleteById(productId, "6314dfe252d9346de079cd41")
  .then(data => {
    res.redirect("/admin/products")
  })
  .catch(err => console.log(err))
}


exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => console.log(err))
};
