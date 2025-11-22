import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../config/sqlConfig.js";

export const UserModel = sequelize.define('user', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    name:{
        type: DataTypes.STRING,
        allowNull:false
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false
    }
})