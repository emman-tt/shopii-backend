import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { sequelize } from './config/sqlConfig.js'
const app = express()
const PORT = 3000
import cors from 'cors'
import routes from './routes/route.js'
import { CategoryModel } from './database/categories.js'
import { ProductModel } from './database/products.js'
import { GenderModel } from './database/gender.js'
import { CartModel } from './database/cart.js'
import { cartProduct } from './database/cartProducts.js'
import { UserModel } from './database/user.js'
/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://emman-tt.github.io/shopii/',
      'https://shopii-web.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', routes)

app.get('/', (req, res) => {
  res.json({
    msg: 'backend running'
  })
})

app.use((err, req, res, next) => {
  console.error('Error caught by middleware:', err)
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  })
})

UserModel.hasOne(CartModel)
CartModel.belongsTo(UserModel)

CartModel.belongsToMany(ProductModel, {
  through: 'cartProduct'
})

ProductModel.belongsToMany(CartModel, {
  through: 'cartProduct'
})

CategoryModel.hasMany(ProductModel, {
  foreignKey: 'categoryId',
  onDelete: 'CASCADE'
})
ProductModel.belongsTo(CategoryModel, {
  foreignKey: 'categoryId'
})

GenderModel.hasMany(ProductModel, {
  foreignKey: 'genderId'
})

ProductModel.belongsTo(GenderModel, {
  foreignKey: 'genderId'
})
;(async function setupDB () {
  try {
    //   await sequelize.sync({alter:true})
    // await sequelize.sync()
  } catch (error) {
    console.log(error.message)
  }
})()

app.listen(PORT, () => {
  console.log('backend successfully running on port ' + PORT)
})
