// models/Actor.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../library/database"); // Sesuaikan dengan path ke file konfigurasi Sequelize Anda

class Actor extends Model {}

Actor.init(
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
    modelName: "Actor",
    tableName: "actor",
    timestamps: false,
  }
);

module.exports = Actor;
