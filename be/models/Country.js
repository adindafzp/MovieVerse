// models/Country.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../library/database');

class Country extends Model {}

Country.init({
    countryId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Country',
    tableName: 'country',
    timestamps: false,
});

module.exports = Country;
