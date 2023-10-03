import express from 'express'
import { uploader } from '../utils/utils.js'
import { ProductsAPIController } from '../controller/productAPI.controller.js'
import { isPremiumOrAdmin } from '../middlewares/auth.js'
const ProductsAPIControllerRouting = new ProductsAPIController()
export const productsAPIRouter = express.Router()

productsAPIRouter.get('/', ProductsAPIControllerRouting.getProducts)

productsAPIRouter.get('/:pid', ProductsAPIControllerRouting.getProductById)

productsAPIRouter.put('/:pid', isPremiumOrAdmin, ProductsAPIControllerRouting.updateProduct)

productsAPIRouter.delete('/:pid', isPremiumOrAdmin, ProductsAPIControllerRouting.deleteProduct)

productsAPIRouter.post('/', isPremiumOrAdmin, uploader.single('file'), ProductsAPIControllerRouting.newProduct)
