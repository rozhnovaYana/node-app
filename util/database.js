const Sequelize = require("sequelize"); // import class;

const sequelize = new Sequelize('node-store', 'root', 'lifeisgood9632', {
    dialect: "mysql", 
    host: "localhost" // default
});

module.exports = sequelize; // database connection pool