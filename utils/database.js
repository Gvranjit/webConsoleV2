const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("minecraft-control", "root", "lovely", {
     dialect: "mysql",

     host: "localhost",
});

module.exports = sequelize;
