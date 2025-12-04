// import { Sequelize, where } from 'sequelize'
/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */
import { ProductModel } from '../database/products.js'
import { UserModel } from '../database/user.js'
import { CartModel } from '../database/cart.js'
import { cartProduct } from '../database/cartProducts.js'
import { json } from 'express'

export async function SaveToCart (req, res) {
  try {
    const currentUser = await UserModel.findByPk(1)
    const { itemID, color, size, quantity } = req.query
    console.log(color, size, quantity)

    const cart = await currentUser.getCart()
    if (!cart) {
      await currentUser.createCart()
    }

    const item = await ProductModel.findByPk(itemID)

    const products = await cart.addProduct(item, {
      through: {
        quantity: quantity,
        colour: color,
        size: size
      }
    })

    const count = await cartProduct.sum('quantity', {
      where: { cartId: cart.id }
    })
    res.status(200).json({
      total: count || 0
    })

  } catch (error) {
    res.status(500).json({
      err: error.message
    })
  }
}

export async function readTotal (req,res) {
  try {
    const count = await cartProduct.sum('quantity', {
      where: { cartId: 1 }
    })

    console.log(count)

  return  res.status(200).json({
      total: count || 0
    })
  } catch (error) {
return    res.status(500).json({
      err: error.message
    })
  }
}
