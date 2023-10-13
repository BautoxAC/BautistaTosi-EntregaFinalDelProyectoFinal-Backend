import express from 'express'
import { isAdmin } from '../middlewares/auth.js'
import { UserViewController } from '../controller/usersView.controller.js'
export const userViewRouter = express.Router()
const userControllerRouting = new UserViewController()

userViewRouter.get('/', isAdmin, userControllerRouting.renderUsers)
