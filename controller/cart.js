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
    const decoded = req.user.anonymousID

    const cart = await CartModel.findOne({
      where: { anonymousId: decoded }
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
    const decodedId = req.user.anonymousID
    const cart = await CartModel.findOne({
      where: { anonymousId: decodedId }
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
    const userId = req.cookies.userToken || null
    let anonymousToken = req.cookies.anonymousToken || null
    let decoded
    if (!userId) {
      if (!anonymousToken) {
        const { accessToken, refreshToken } = generateAnonymousTokens()

        res.cookie('anonymousToken', accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 1000 * 60 * 25
        })

        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 7 * 24 * 60 * 60 * 1000
        })

        decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        const decodedId = decoded.anonymousID
        console.log(decodedId)

        let cart = await CartModel.findOne({
          where: { anonymousId: decodedId }
        })
        if (!cart) {
          cart = await CartModel.create({ anonymousId: decodedId })
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

        return res.status(200).json({
          msg: 'added succesfuly to cart',
          total: count || 0
        })
      }

      decoded = jwt.verify(anonymousToken, process.env.ACCESS_TOKEN_SECRET)
      const decodedId = decoded.anonymousID
      console.log(decodedId)

      let cart = await CartModel.findOne({
        where: { anonymousId: decodedId }
      })
      if (!cart) {
        cart = await CartModel.create({ anonymousId: decodedId })
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
      return res.status(200).json({
        msg: 'added succesfuly to cart',
        total: count || 0
      })
    }
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

    const decodedId = req.user.anonymousID

    const cart = await CartModel.findOne({
      where: { anonymousId: decodedId }
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

    const decodedId = req.user.anonymousID
    const cart = await CartModel.findOne({
      where: { anonymousId: decodedId }
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
