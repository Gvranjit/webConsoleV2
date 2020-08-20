const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const { model, databaseVersion } = require("../utils/database");

const User = sequelize.define("User", {
     id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
     },
     firstName: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     lastName: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     nickName: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     email: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     password: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     profileImage: {
          type: DataTypes.STRING,
          allowNull: true,
     },
     mobile: {
          type: DataTypes.STRING,
     },
     admin: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
     },
});

module.exports = User;
