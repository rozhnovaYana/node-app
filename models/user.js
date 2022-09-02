const Sequelize = require("sequelize"); // class

const sequelize = require("../util/database"); // fully-configured sequelize environment  

const User = sequelize.define('user', {
    id: {
       type: Sequelize.INTEGER,
       allowNull: false,
       primaryKey: true,
       autoIncrement: true 
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false 
    }
});

module.exports = User;