const sequelize = require("../utils/database");
const { DataTypes } = require("sequelize");
const { model, Sequelize } = require("../utils/database");

const Post = sequelize.define("Post", {
     id: {
          type: DataTypes.UUID,

          primaryKey: true,
          allowNull: false,
     },
     contentType: {
          type: DataTypes.STRING,
          default: "text",
     },
     content: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     imagePath: {
          type: DataTypes.STRING,
     },
     edited: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
     },
});

module.exports = Post;
