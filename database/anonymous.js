import { DataTypes, Sequelize } from 'sequelize'
import { sequelize } from '../config/sqlConfig.js'

/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */

export const AnonymousModel = sequelize.define('anonymous', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  data: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
})
