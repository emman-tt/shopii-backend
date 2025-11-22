import express from 'express'
const router = express.Router()
import upload from '../config/cloudinary.js'
import { Uploader } from '../controller/Upload.js'
import { GetAllProducts } from '../controller/Product.js'
router.post('/upload', upload.single('image'), Uploader)
router.get('/AllProducts', GetAllProducts)

export default router
