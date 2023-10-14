import express from 'express'
import { isUser } from '../middlewares/auth.js'
import { HomeController } from '../controller/home.controller.js'
export const homeRouter = express.Router()
const homeControllerRouting = new HomeController()

homeRouter.get('/', isUser, homeControllerRouting.renderAllProducts)

homeRouter.get('/:pid', isUser, homeControllerRouting.renderDetails)
