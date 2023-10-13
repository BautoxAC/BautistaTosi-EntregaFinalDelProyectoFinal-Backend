import express from 'express'
import { isUser, isAdmin } from '../middlewares/auth.js'
import { UserAPIController } from '../controller/userAPI.controller.js'
import { uploader } from '../utils/utils.js'
export const userAPIRouter = express.Router()
const userControllerRouting = new UserAPIController()

userAPIRouter.post('/premium/:uname', isAdmin, userControllerRouting.changerole)

userAPIRouter.get('/premium/:uid', isUser, userControllerRouting.renderChangeRole)

userAPIRouter.post('/:uid/documents', isUser, uploader.fields([
  { name: 'identificacion', maxCount: 1 },
  { name: 'comprobanteDomicilio', maxCount: 1 },
  { name: 'comprobanteEstadoCuenta', maxCount: 1 }
]), userControllerRouting.saveDocuments)

userAPIRouter.get('/', isAdmin, userControllerRouting.getUsers)

userAPIRouter.delete('/', isAdmin, userControllerRouting.deleteInactiveUsers)

userAPIRouter.delete('/:uname', isAdmin, userControllerRouting.deleteUserWithCart)
