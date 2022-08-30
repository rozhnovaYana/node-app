const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "node-store",
    password: "lifeisgood9632"
});

module.exports = pool.promise()
