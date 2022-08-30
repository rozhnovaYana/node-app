const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

const getCart = (cb) => {
    fs.readFile(p, (error, data) => {
        let cart = {products: [], totalPrice: 0};
        if(!error){
            cart = JSON.parse(data)
        }
        cb(cart)
    })
}

module.exports = class Cart{
    static addToCart(id, price){
        getCart(cart => {
            const indexOfProduct = cart.products.findIndex(item => item.id === id);

            if(indexOfProduct !== -1){
                cart.products[indexOfProduct].qty = cart.products[indexOfProduct].qty + 1;
            } else {
                cart.products = [...cart.products, {
                    id, qty: 1
                } ]
            }
            cart.totalPrice = cart.totalPrice + +price;
            fs.writeFile(p, JSON.stringify(cart) ,error => {
                console.log(error)
            })
        })

    }
    static deleteProductById(id, price){
        getCart(cart => {
            const product = cart.products.find(item => item.id === id);
            if(!product) return
            const qty = product.qty;
            const products = cart.products.filter(item => item.id !== id);
            const totalPrice = cart.totalPrice - (+price * qty);
            fs.writeFile(p, JSON.stringify({products, totalPrice}) ,error => {
                console.log(error)
            })
        })
    }
    static getProducts(cb){
        getCart(cb)
    }
}