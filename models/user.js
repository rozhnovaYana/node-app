const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    cart:{
        items: [{
            productID: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});
userSchema.methods.addToCart = function(productId){
    const productIndex = this.cart.items.findIndex(el =>  el.productID == productId);
    let quantity = 1;
    const newCartItems = [...this.cart.items];
    if(productIndex > -1){
        quantity = this.cart.items[productIndex].quantity + 1;
        newCartItems[productIndex] = {productID: productId, quantity}
    }
    else{
        newCartItems.push({productID: productId, quantity})
    }
    this.cart = {items: newCartItems}
    return this.save()
}
userSchema.methods.deleteProductFromCart = function(productId){
    const newCartItems = this.cart.items.filter(item => item.productID.toString() !== productId.toString())
    this.cart = {items: newCartItems}
    return this.save()
}

module.exports = mongoose.model("User", userSchema);
// const { ObjectID } = require("bson");
// const { getDB } = require("../util/database");

// class User {
//     constructor(username, email, id, cart ){
//         this.username = username;
//         this.email = email;
//         this._id = ObjectID(id);
//         this.cart = cart;
//     }
//     save(){
//         const db = getDB();
//         return db.collection("users").insertOne(this);
//     }
//     addToCart(productId){
//         const productIndex = this.cart.items.findIndex(el =>  el.productId == productId);
//         let quantity = 1;
//         const newCartItems = [...this.cart.items];
//         if(productIndex > -1){
//             quantity = this.cart.items[productIndex].quantity + 1;
//             newCartItems[productIndex] = {productId: ObjectID(productId), quantity}
//         }
//         else{
//             newCartItems.push({productId: ObjectID(productId), quantity})
//         }
//         const db = getDB();
//         return db.collection("users").updateOne({_id: this._id}, {
//             $set: {
//                 cart: {items: newCartItems}
//             }
//         });
//     }
//     deleteFromCart(productId){
//         const newCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString())
//         const db = getDB();
//         return db.collection("users").updateOne({_id: this._id}, {
//             $set: {
//                 cart: {items: newCartItems}
//             }
//         });
//     }
//     getCart(){
//         const productIds = this.cart.items.map(i => i.productId)
//         const db = getDB();
//         return db.collection("products").find({_id: {$in: productIds}}).toArray()
//         .then(products => {
//             return products.map(i => {
//                 const quantity = this.cart.items.find(el => el.productId.toString() == i._id.toString())?.quantity;
//                 return ({
//                     ...i, quantity
//                 })
//             })
//         })
//     }

//     addToOrders(){
//         const db = getDB();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     products, 
//                     user: {
//                         name: this.name,
//                         _id: this._id
//                     }
//                 }
//                 return db.collection("orders").insertOne(order)
//             })
//             .then(result => {
//                 this.cart.items = []
//                 return db.collection("users").updateOne({_id: this._id}, {
//                     $set: {
//                         cart: {items: []}
//                     }
//                 });
//             })
//     }
//     getOrders(){
//         const db = getDB();
//         return db.collection("orders").find({'user._id': this._id}).toArray()
//     }
//     static findUserById(userID){
//         const db = getDB();
//         return db.collection("users").findOne({_id: ObjectID(userID)});
//     }
// };
// module.exports = User;