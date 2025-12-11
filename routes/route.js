import express from 'express'
const router = express.Router()
import upload from '../config/cloudinary.js'
import { Uploader } from '../controller/Upload.js'
import { GetAllProducts } from '../controller/Product.js'
import { SaveToCart } from '../controller/cart.js'
import { GetSPP } from '../controller/Product.js'
import {
  readTotal,
  DeleteFromCart,
  fetchCart,
  UpdateCart
} from '../controller/cart.js'
router.get('/getSPP', GetSPP)
router.post('/upload', upload.single('image'), Uploader)
router.get('/AllProducts', GetAllProducts)
router.post('/cart', SaveToCart)
router.get('/fetchCart', fetchCart)
router.put('/fetchTotal', readTotal)
router.delete('/RemoveCart', DeleteFromCart)
router.put('/UpdateCart', UpdateCart)

export default router
