import { DataTypes } from 'sequelize'
import { sequelize } from '../config/sqlConfig.js'
export const UserModel = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  },
  {
    tableName: 'users',
    timestamps: true
  }
)
