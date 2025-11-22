import { Sequelize, where } from 'sequelize'
/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */
import { ProductModel } from '../database/products.js'
import { CartModel } from '../database/cart.js'
import { CategoryModel } from '../database/categories.js'
import { GenderModel } from '../database/gender.js'
import { Op } from 'sequelize'

export async function GetAllProducts (req, res) {
  try {
    const page = Number(req.query.page)
    const category = Number(req.query.category)
    const gender = Number(req.query.gender)
    const color = req.query.color.toLowerCase()

    // console.log(color)

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
          [Op.and]: [
            Sequelize.where(
              Sequelize.fn(
                'JSON_CONTAINS',
                Sequelize.col('colours'),
                JSON.stringify([color])
              ),
              true
            )
          ]
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
          Sequelize.where(
            Sequelize.fn(
              'JSON_CONTAINS',
              Sequelize.col('colours'),
              JSON.stringify([color])
            ),
            true
          )
        ]
      }
    })

    const products = categoryProducts.map(item => item.dataValues)
    res.status(200).json({ products: products })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
