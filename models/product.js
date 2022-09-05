const { ObjectID } = require("bson");
const { getDB } = require("../util/database");
class Product{
  constructor(title, price, imageUrl, description, id, userId){
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id && ObjectID(id);
    this.userId = userId;
  }
  save(){
    const db = getDB();
    console.log(this._id)
    if(this._id){
      return db.collection('products').updateOne({_id: this._id}, {$set: this})
    }
    else{
      return db.collection('products').insertOne(this)
    }
  }
  static findProduct(id){
    const db = getDB();
    return db.collection("products").findOne({_id: ObjectID(id)})
  }

  static fetchAll(){
    const db = getDB();
    return db.collection('products').find().toArray()
  }

  static deleteById(prodId, userId){
    const db = getDB();
    return db
      .collection('products')
      .deleteOne({ _id: ObjectID(prodId) })
      .then((result) => {
        return db.collection('users').updateOne(
          { _id: ObjectID(userId) },
          {
            $pull: {
              'cart.items': { productId: ObjectID(prodId) },
            },
          }
        );
      })

  }
}
module.exports = Product;