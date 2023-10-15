import { AuthService } from '../services/auth.service.js'
import { dataResponseToString } from '../utils/dataResponseToString.js'
const authServiceControlling = new AuthService()
export class AuthController {
  renderLogin (req, res) {
    return res.render('login', {})
  }

  logUser (req, res) {
    if (!req.user) {
      return res.render('error', { error: 'invalid credentials' })
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
    return res.render('error', { error: 'fail to login' })
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
    return res.render('register', {})
  }

  registerUser (req, res) {
    if (!req.user) {
      return res.render('error', { error: 'something went wrong' })
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
    return res.render('error', { error: 'fail to register' })
  }

  getSecret (req, res) {
    return res.render('secretInfo')
  }

  async sendEmail (req, res) {
    const { email } = req.body
    const host = req.get('host')
    const response = dataResponseToString(await authServiceControlling.sendEmail(email, host))
    return res.status(200).render('response', { response })
  }

  renderRecover (req, res) {
    const { code, email } = req.query
    return res.render('recoverPass', { code, email })
  }

  async passRecover (req, res) {
    const { code: stringCode, email, password: newPass } = req.query
    const response = dataResponseToString(await authServiceControlling.passRecover(newPass, stringCode, email))
    return res.status(200).render('response', { response })
  }
}
