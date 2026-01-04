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
import { Authenticator, EnsureAnonymous } from '../middleware/auth.js'
router.get('/getSPP', GetSPP)
router.post('/upload', upload.single('image'), Uploader)
router.get('/AllProducts', GetAllProducts)
router.post('/cart', EnsureAnonymous, SaveToCart)
router.get('/fetchCart', Authenticator, fetchCart)
router.put('/fetchTotal', Authenticator, readTotal)
router.delete('/RemoveCart', Authenticator, DeleteFromCart)
router.put('/UpdateCart', Authenticator, UpdateCart)

export default router
