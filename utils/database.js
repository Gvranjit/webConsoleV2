const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("minecraftControl", "craftnepal", "Admin123$", {
     dialect: "mysql",
     host: "localhost",
});

module.exports = sequelize;
