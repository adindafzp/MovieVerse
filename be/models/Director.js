// models/Director.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../library/database");

class Director extends Model {}

Director.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    countryId: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    biography: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Director",
    tableName: "director",
    timestamps: false,
  }
);

module.exports = Director; // Ensure correct export
