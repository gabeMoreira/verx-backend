const Sequelize = require('sequelize');
const db = require('../utils/database');

const Producer = db.define('producer', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    cpfOrCnpj: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    farmName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },
    state: {
        type: Sequelize.STRING,
        allowNull: false
    },
    totalAreaHectares: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    cultivableAreaHectares: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    vegetationAreaHectares: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    plantedCrops: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
    }
})

module.exports = Producer;