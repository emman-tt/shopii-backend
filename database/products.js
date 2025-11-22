import { DataTypes, Sequelize } from 'sequelize'
import { sequelize } from '../config/sqlConfig.js'

/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */

export const ProductModel = sequelize.define('product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false
  },
  highlights: {
    type:  DataTypes.JSON,
    allowNull: false
  },
  colours:{
    type: DataTypes.JSON,
    allowNull:false
  }
})
