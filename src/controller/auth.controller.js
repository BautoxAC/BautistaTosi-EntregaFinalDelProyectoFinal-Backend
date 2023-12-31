import { AuthService } from '../services/auth.service.js'
import { dataResponseToString } from '../utils/dataResponseToString.js'
import { CurrentUser } from '../DAO/DTOs/currentUser.dto.js'
import { UsersManagerDBService } from '../services/users.service.js'
import { errorCases } from '../services/errors/errorCases.js'
const authServiceControlling = new AuthService()
const UsersManager = new UsersManagerDBService()

export class AuthController {
  renderLogin (req, res) {
    return res.status(200).render('login', {})
  }

  logUser (req, res) {
    if (!req.user) {
      return res.status(400).render('error', { error: 'invalid credentials' })
    }
    req.session.user = {
      _id: req.user?._id,
      email: req.user.email,
      firstName: req.user?.firstName,
      lastName: req.user?.lastName,
      role: req.user.role,
      age: req.user?.age,
      cart: req.user.cart
    }
    return res.redirect('/home')
  }

  loginFail (req, res) {
    return res.status(400).render('error', { error: 'fail to login' })
  }

  async logOut (req, res) {
    const userMail = req?.session?.user?.email
    req.session.destroy(async (err) => {
      if (err) {
        return res.status(500).render('error', { error: 'no se pudo cerrar su session' })
      }
      await authServiceControlling.updateLastConnectionUser(userMail)
      return res.redirect('/auth/login')
    })
  }

  renderRegister (req, res) {
    return res.status(200).render('register', {})
  }

  registerUser (req, res) {
    if (!req.user) {
      return res.status(500).render('error', { error: 'something went wrong' })
    }
    req.session.user = {
      _id: req.user._id,
      age: req.user.age,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      cart: req.user.cart
    }
    return res.redirect('/home')
  }

  registerFail (req, res) {
    return res.status(200).render('error', { error: 'fail to register' })
  }

  getSecret (req, res) {
    return res.status(200).render('secretInfo')
  }

  async sendEmail (req, res) {
    try {
      const { email } = req.body
      const host = req.get('host')
      const response = dataResponseToString(await authServiceControlling.sendEmail(email, host))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.status(errorCases(e.statusCode)).render('error', { error: e.message })
    }
  }

  renderRecover (req, res) {
    const { code, email } = req.query
    return res.status(200).render('recoverPass', { code, email })
  }

  async passRecover (req, res) {
    try {
      const { code: stringCode, email, password: newPass } = req.query
      const response = dataResponseToString(await authServiceControlling.passRecover(newPass, stringCode, email))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.status(e.statusCode).render('error', { error: e.message })
    }
  }

  redirectHome (req, res) {
    req.session.user = req.user
    res.status(200).redirect('/home')
  }

  async RenderCurrentSession (req, res) {
    try {
      const CurrentUserDTO = new CurrentUser(req.session.user)
      const userId = req.session.user._id
      const user = await UsersManager.getUserByUserName(req.session.user.email)
      const documents = user.data?.documents
      return res.status(200).render('profile', { CurrentUserDTO, userId, documents })
    } catch (e) {
      return res.status(errorCases(e.statusCode)).render('error', { error: e.message })
    }
  }

  async saveDocuments (req, res) {
    try {
      const identificacionFile = req.files?.identificacion?.[0]
      const comprobanteDomicilioFile = req.files?.comprobanteDomicilio?.[0]
      const comprobanteEstadoCuentaFile = req.files?.comprobanteEstadoCuenta?.[0]
      const userName = req.session.user.email
      const response = dataResponseToString(await authServiceControlling.saveDocuments(identificacionFile, comprobanteDomicilioFile, comprobanteEstadoCuentaFile, userName))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.status(errorCases(e.statusCode)).render('error', { error: e.message })
    }
  }
}
