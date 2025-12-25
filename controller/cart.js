// import { Sequelize, where } from 'sequelize'
/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */
import { ProductModel } from '../database/products.js'
import { UserModel } from '../database/user.js'
import { CartModel } from '../database/cart.js'
import { cartProduct } from '../database/cartProducts.js'

export async function UpdateCart (req, res) {
  try {
    const { productID, qty } = req.query

    const prodID = Number(productID)
    const quantity = Number(qty)

    const currentUser = await UserModel.findByPk(1)
    const cart = await currentUser.getCart()
    const item = await cart.getProducts({
      where: {
        id: productID
      }
    })

    if (item && item.length > 0) {
      const product = item[0]
      const oldQuantity = product.cartProduct.quantity
      const newQuantity = oldQuantity + quantity

      await product.cartProduct.update({ quantity: newQuantity })



      return res.status(200).json({
        id: prodID,
        quantity: newQuantity
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      err: error.message
    })
  }
}

export async function DeleteFromCart (req, res) {
  try {
    const { productID } = req.query
    const user = await UserModel.findByPk(1)
    const cart = await user.getCart()

    if (cart && user) {
      await cartProduct.destroy({
        where: {
          cartId: cart.id,
          productId: productID
        }
      })
    }

    res.status(200).json({
      msg: 'Deleted succesfully'
    })
  } catch (error) {
    res.status(500).json({
      err: error.message
    })
  }
}

export async function SaveToCart (req, res) {
  try {
    const currentUser = await UserModel.findByPk(1)
    const { itemID, color, size, quantity } = req.query
    // console.log(color, size, quantity)

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

export async function readTotal (req, res) {
  try {
    const count = await cartProduct.sum('quantity', {
      where: { cartId: 1 }
    })

    // console.log(count)
    return res.status(200).json({
      total: count || 0
    })
  } catch (error) {
    return res.status(500).json({
      err: error.message
    })
  }
}

export async function fetchCart (req, res) {
  try {
    const currentUser = await UserModel.findByPk(1)
    const cart = await currentUser.getCart()
    if (!cart) {
      await currentUser.createCart()
    }
    const items = await cart.getProducts({
      through: { attributes: ['colour', 'size', 'quantity'] }
    })

    if (items) {
      const products = items.map(item => item.dataValues)
      
      return res.status(200).json({
        products: products
      })
    }
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      err: error.message
    })
  }
}
