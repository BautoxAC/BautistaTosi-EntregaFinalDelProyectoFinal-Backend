import express from 'express'
import { isAdmin } from '../middlewares/auth.js'
import { UsersController } from '../controller/users.controller.js'
export const usersRouter = express.Router()
const usersControllerRouting = new UsersController()

usersRouter.post('/premium/:uname', isAdmin, usersControllerRouting.changerole)

usersRouter.delete('/', isAdmin, usersControllerRouting.deleteInactiveUsers)

usersRouter.delete('/:uname', isAdmin, usersControllerRouting.deleteUserWithCart)

usersRouter.get('/', isAdmin, usersControllerRouting.renderUsers)
