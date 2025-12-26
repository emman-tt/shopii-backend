import { DataTypes, Sequelize } from 'sequelize'
import { sequelize } from '../config/sqlConfig.js'

/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */

export const CartModel = sequelize.define('cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sessionId: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
})
