import dotenv from 'dotenv'
dotenv.config()
import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize(process.env.SUPABASE_DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

try {
  await sequelize.authenticate()
  console.log(' Database Connected!')
} catch (error) {
  console.error(' Database Error:', error.message)
}
