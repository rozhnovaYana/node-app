const Sequelize = require("sequelize"); // class

const sequelize = require("../util/database"); // fully-configured sequelize environment  

const OrderItem = sequelize.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
});

module.exports = OrderItem;