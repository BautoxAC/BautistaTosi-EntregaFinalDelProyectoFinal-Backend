import express from 'express'
import { uploader } from '../utils/utils.js'
import { ProductsController } from '../controller/product.controller.js'
import { isPremiumOrAdmin } from '../middlewares/auth.js'
const ProductsControllerRouting = new ProductsController()
export const productsRouter = express.Router()

productsRouter.get('/', ProductsControllerRouting.getProducts)

productsRouter.get('/:pid', ProductsControllerRouting.getProductById)

productsRouter.put('/:pid', isPremiumOrAdmin, ProductsControllerRouting.updateProduct)

productsRouter.delete('/:pid', isPremiumOrAdmin, ProductsControllerRouting.deleteProduct)

productsRouter.post('/', isPremiumOrAdmin, uploader.single('file'), ProductsControllerRouting.newProduct)
