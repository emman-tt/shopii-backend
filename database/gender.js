import { Sequelize } from 'sequelize'
import { sequelize } from '../config/sqlConfig.js'

/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */

export const GenderModel = sequelize.define('gender', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    allowNull: false,
    type: Sequelize.STRING
  }
})
