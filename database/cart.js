import { DataTypes, Sequelize } from 'sequelize'
import { sequelize } from '../config/sqlConfig.js'

/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */


export const CartModel = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});


