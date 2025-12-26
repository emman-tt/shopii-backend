import { Sequelize } from 'sequelize'
/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */
import { ProductModel } from '../database/products.js'
import { CartModel } from '../database/cart.js'
import { CategoryModel } from '../database/categories.js'
import { GenderModel } from '../database/gender.js'
import { UserModel } from '../database/user.js'
import { Op } from 'sequelize'

export async function GetSPP (req, res) {
  try {
    const productID = Number(req.query.ID)
    // console.log(productID)
    const item = await ProductModel.findByPk(productID)
    if (item) {
      const product = item.toJSON()
      return res.status(200).json({ product: product })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ error: error.message })
  }
}

export async function GetAllProducts (req, res) {
  try {
    const page = Number(req.query.page)
    const category = Number(req.query.category)
    const gender = Number(req.query.gender)
    const color = req.query.color.toLowerCase()

    const limit = 12
    const skip = (page - 1) * limit

    if (category != 1 && color === 'all') {
      const categoryProducts = await ProductModel.findAll({
        where: {
          genderId: gender,
          categoryId: category - 1
        }
      })

      const products = categoryProducts.map(item => item.dataValues)
      return res.status(200).json({ products: products })
    }

    if (category === 1) {
      const genderId = await GenderModel.findOne({
        where: { id: gender }
      })

      if (color === 'all') {
        const data = await genderId.getProducts()
        const items = data.map(item => item.toJSON())
        return res.status(200).json({ products: items })
      }
      const data = await genderId.getProducts({
        // limit: limit,
        // offset: skip,
        where: {
          colours: {
            [Op.contains]: [color]
          }
        }
      })
      if (data) {
        const items = data.map(item => item.toJSON())
        return res.status(200).json({ products: items })
      } else {
        console.log('no data')
      }
    }

    const categoryProducts = await ProductModel.findAll({
      where: {
        genderId: gender,
        categoryId: category - 1,
        [Op.and]: [
          {
            colours: {
              [Op.contains]: [color]
            }
          }
        ]
      }
    })

    const products = categoryProducts.map(item => item.dataValues)
    res.status(200).json({ products: products })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message })
  }
}
