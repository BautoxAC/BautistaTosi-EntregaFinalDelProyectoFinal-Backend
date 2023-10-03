import express from 'express'
import { CartsController } from '../controller/carts.controller.js'
import { isUser, isYourCart } from '../middlewares/auth.js'
export const cartsAPIRouter = express.Router()
const CartsControllerRouting = new CartsController()

cartsAPIRouter.get('/', CartsControllerRouting.getCartMycart)

cartsAPIRouter.post('/', isUser, CartsControllerRouting.addCart)

cartsAPIRouter.post('/:cid/products/:pid', isYourCart, CartsControllerRouting.addProduct)

cartsAPIRouter.delete('/:cid/products/:pid', isYourCart, CartsControllerRouting.deleteProduct)

cartsAPIRouter.delete('/:cid', isYourCart, CartsControllerRouting.deleteAllProducts)

cartsAPIRouter.put('/:cid', isYourCart, CartsControllerRouting.addNewProducts)

cartsAPIRouter.post('/:cid/purchase', isYourCart, CartsControllerRouting.createATicketToBuy)
