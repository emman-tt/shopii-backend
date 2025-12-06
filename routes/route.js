import express from 'express'
const router = express.Router()
import upload from '../config/cloudinary.js'
import { Uploader } from '../controller/Upload.js'
import { GetAllProducts} from '../controller/Product.js'
import { SaveToCart } from '../controller/cart.js'
import { GetSPP } from '../controller/Product.js'
import { readTotal } from '../controller/cart.js'
import { fetchCart } from '../controller/cart.js'
router.get('/getSPP', GetSPP)
router.post('/upload', upload.single('image'), Uploader)
router.get('/AllProducts', GetAllProducts)
router.post('/cart', SaveToCart)
router.get('/fetchCart', fetchCart)
router.put('/fetchTotal', readTotal)

export default router
