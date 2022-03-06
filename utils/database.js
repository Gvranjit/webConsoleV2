const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("minecraft-control", "craftnepal", "Admin123$", {
     dialect: "mysql",
     host: "localhost",
});

module.exports = sequelize;
