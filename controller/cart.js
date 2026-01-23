// import { Sequelize, where } from 'sequelize'
/** @type {import('sequelize').ModelStatic<import('sequelize').Model>} */
import { ProductModel } from '../database/products.js'
import { UserModel } from '../database/user.js'
import { CartModel } from '../database/cart.js'
import { cartProduct } from '../database/cartProducts.js'
import { generateAnonymousTokens } from '../middleware/auth.js'
import jwt from 'jsonwebtoken'
import { AnonymousModel } from '../database/anonymous.js'
export async function UpdateCart (req, res) {
  try {
    const { productID, qty } = req.query

    const prodID = Number(productID)
    const quantity = Number(qty)

    if (prodID === 0) {
      return res.status(200).json({
        msg: 'declined'
      })
    }

    let anonymousToken = req.cookies.anonymousToken || null

    if (!anonymousToken) {
      return res.status(401).json({
        msg: 'no access token'
      })
    }
    const anonymousUserCart = req.anonymousUserCart
    // const decoded = req.user.anonymousID

    const cart = await CartModel.findOne({
      where: { anonymousId: anonymousUserCart }
    })

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
    console.log('update cart error', error.message)
    res.status(500).json({
      err: error.message
    })
  }
}

export async function DeleteFromCart (req, res) {
  try {
    const { productID } = req.query

    let anonymousToken = req.cookies.anonymousToken || null

    if (!anonymousToken) {
      return res.status(401).json({
        msg: 'no access token denied'
      })
    }
    const anonymousUserCart = req.anonymousUserCart
    // const decodedId = req.user.anonymousID
    const cart = await CartModel.findOne({
      where: { anonymousId: anonymousUserCart }
    })
    if (cart) {
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
    console.log('delete from cart error', error.message)
    res.status(500).json({
      err: error.message
    })
  }
}

export async function SaveToCart (req, res) {
  try {
    const { itemID, quantity, color, size } = req.query

    // const decodedId = req.user.anonymousID
    const anonymousUserCart = req.anonymousUserCart

    let cart = await CartModel.findOne({
      where: { anonymousId: anonymousUserCart }
    })
    if (!cart) {
      cart = await CartModel.create({ anonymousId: anonymousUserCart })
    }
    const item = await ProductModel.findByPk(itemID)
    await cart.addProduct(item, {
      through: {
        quantity: quantity,
        colour: color,
        size: size
      }
    })

    const count = await cartProduct.sum('quantity', {
      where: { cartId: cart.id }
    })
    return res.status(200).json({
      msg: 'added succesfuly to cart',
      total: count || 0
    })
  } catch (error) {
    console.log('save to cart error', error.message)
    res.status(500).json({
      err: error.message
    })
  }
}

export async function readTotal (req, res) {
  try {
    let anonymousToken = req.cookies.anonymousToken || null

    if (!anonymousToken) {
      return res.status(200).json({
        total: 0
      })
    }
    const anonymousUserCart = req.anonymousUserCart

    const cart = await CartModel.findOne({
      where: { anonymousId: anonymousUserCart }
    })
    const count = await cartProduct.sum('quantity', {
      where: { cartId: cart.id }
    })
    return res.status(200).json({
      total: count || 0
    })
  } catch (error) {
    console.log('read total error', error.message)
    return res.status(500).json({
      err: error.message
    })
  }
}

export async function fetchCart (req, res) {
  try {
    let anonymousToken = req.cookies.anonymousToken || null

    if (!anonymousToken) {
      return res.status(200).json({
        products: []
      })
    }

    const anonymousUserCart = req.anonymousUserCart
    // const decodedId = req.user.anonymousID
    const cart = await CartModel.findOne({
      where: { anonymousId: anonymousUserCart }
    })

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
    console.log('fetch error', error.message)
    return res.status(500).json({
      err: error.message
    })
  }
}
