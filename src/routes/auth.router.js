import express from 'express'
import { isUser, isAdmin, AdminCredentials } from '../middlewares/auth.js'
import passport from 'passport'
import { uploader } from '../utils/utils.js'
import { AuthController } from '../controller/auth.controller.js'
export const authRouter = express.Router()
const authControllerRouting = new AuthController()

authRouter.get('/login', authControllerRouting.renderLogin)

authRouter.post('/login', AdminCredentials, passport.authenticate('login', { failureRedirect: '/auth/faillogin' }), authControllerRouting.logUser)

authRouter.get('/faillogin', authControllerRouting.loginFail)

authRouter.get('/logout', authControllerRouting.logOut)

authRouter.get('/register', authControllerRouting.renderRegister)

authRouter.post('/register', AdminCredentials, passport.authenticate('register', { failureRedirect: '/auth/failregister' }), authControllerRouting.registerUser)

authRouter.get('/failregister', authControllerRouting.registerFail)

authRouter.get('/administracion', isUser, isAdmin, authControllerRouting.getSecret)

authRouter.get('/passrecover', authControllerRouting.renderRecover)

authRouter.post('/sendemail', authControllerRouting.sendEmail)

authRouter.put('/passrecover', authControllerRouting.passRecover)

authRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

authRouter.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), authControllerRouting.redirectHome)

authRouter.post('/:uid/documents', isUser, uploader.fields([
  { name: 'identificacion', maxCount: 1 },
  { name: 'comprobanteDomicilio', maxCount: 1 },
  { name: 'comprobanteEstadoCuenta', maxCount: 1 }
]), authControllerRouting.saveDocuments)

authRouter.get('/currentView', authControllerRouting.RenderCurrentSession)
