const Sequelize = require("sequelize"); // class
const sequelize = require("../util/database"); // class

const Order = sequelize.define('order', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
});

module.exports = Order;