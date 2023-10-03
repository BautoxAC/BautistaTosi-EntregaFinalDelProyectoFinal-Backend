import express from 'express'
import { isUser } from '../middlewares/auth.js'
import { UserController } from '../controller/userAPI.controller.js'
import { uploader } from '../utils/utils.js'
export const userRouter = express.Router()
const userControllerRouting = new UserController()

userRouter.put('/premium/:uid', isUser, userControllerRouting.changerole)

userRouter.get('/premium/:uid', isUser, userControllerRouting.renderChangeRole)

userRouter.post('/:uid/documents', isUser, uploader.fields([
  { name: 'identificacion', maxCount: 1 },
  { name: 'comprobanteDomicilio', maxCount: 1 },
  { name: 'comprobanteEstadoCuenta', maxCount: 1 }
]), userControllerRouting.saveDocuments)
