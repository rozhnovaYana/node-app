const Sequelize = require("sequelize"); // class

const sequelize = require("../util/database"); // fully-configured sequelize environment  

const Cart = sequelize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

module.exports = Cart;