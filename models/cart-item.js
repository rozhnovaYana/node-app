const Sequelize = require("sequelize"); // class

const sequelize = require("../util/database"); // fully-configured sequelize environment  

const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = CartItem;