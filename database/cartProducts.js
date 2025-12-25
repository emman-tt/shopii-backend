import { DataTypes, Sequelize } from 'sequelize'
import { sequelize } from '../config/sqlConfig.js'

export const cartProduct = sequelize.define(
  'cartProduct',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    colour: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    size: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName:"cartproduct",
    freezeTableName: true,
   
  }
)
