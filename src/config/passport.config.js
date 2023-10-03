import { userModel } from '../DAO/models/users.model.js'
import GitHubStrategy from 'passport-github2'
import passport from 'passport'
import local from 'passport-local'
import { newMessage, createHash, isValidPassword, formattedDate } from '../utils/utils.js'
import { CartManagerDBService } from '../services/carts.service.js'
import { fileURLToPath } from 'url'
import config from './env.config.js'
import { EErros } from '../services/errors/enums.js'
import fetch from 'node-fetch'

import { CustomError } from '../services/errors/custom-error.js'
const LocalStrategy = local.Strategy
const { clientID, clientSecret, url } = config
const cartManager = new CartManagerDBService()
// ---------------- GITHUB PASSPORT ----------------
export function iniPassPortLocalAndGithub () {
  passport.use(
    'login',
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username })
        if (!user) {
          CustomError.createError({
            name: 'Finding a user Error',
            cause: 'User Not Found with username (email) ' + username,
            message: 'Error to find a user',
            code: EErros.INCORRECT_CREDENTIALS_ERROR
          })
          return done(null, false)
        }
        if (!isValidPassword(password, user.password)) {
          CustomError.createError({
            name: 'Validating a user Error',
            cause: 'Invalid Password',
            message: 'Error to validate a user',
            code: EErros.INCORRECT_CREDENTIALS_ERROR
          })
          return done(null, false)
        }
        user.last_connection = formattedDate()
        await userModel.updateOne({ _id: user._id.toString() }, user)
        newMessage('success', 'success in logging with passport(the user alredy exists)', {})
        return done(null, user)
      } catch (e) {
        newMessage('failure', 'Failed to find a user', e.toString(), fileURLToPath(import.meta.url))
        return done(e)
      }
    })
  )

  passport.use(
    'register',
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: 'email'
      },
      async (req, username, password, done) => {
        try {
          const { email, firstName, lastName, age } = req.body
          const user = await userModel.findOne({ email: username })
          if (user) {
            CustomError.createError({
              name: 'Registering a user Error',
              cause: 'User already exists',
              message: 'Error to register a user',
              code: EErros.INCORRECT_CREDENTIALS_ERROR
            })
            return done(null, false)
          }
          const newCart = await cartManager.addCart()
          const newUser = {
            email,
            firstName,
            lastName,
            age,
            password: createHash(password),
            role: 'user',
            cart: newCart.data._id,
            last_connection: formattedDate()
          }
          const userCreated = await userModel.create(newUser)
          newMessage('success', 'success in registering with passport', {})
          return done(null, userCreated)
        } catch (e) {
          newMessage('failure', 'Failed to find a user', e.toString(), fileURLToPath(import.meta.url))
          return done(e)
        }
      }
    )
  )
  // GITHUB
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID,
        clientSecret,
        callbackURL: `${url}/api/sessions/githubcallback`
      },
      async (accesToken, _, profile, done) => {
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28'
            }
          })
          const emails = await res.json()
          // eslint-disable-next-line eqeqeq
          const emailDetail = emails.find((email) => email.verified == true)
          if (!emailDetail) {
            CustomError.createError({
              name: 'Validating a user Error',
              cause: 'cannot get a valid email for this user',
              message: 'Error to find the email of the user',
              code: EErros.INCORRECT_CREDENTIALS_ERROR
            })
          }
          profile.email = emailDetail.email
          const user = await userModel.findOne({ email: profile.email })
          if (!user) {
            const newCart = await cartManager.addCart()
            const newUser = {
              email: profile.email,
              firstName: profile._json.name || profile._json.login || 'noname',
              lastName: 'nolast',
              role: 'user',
              age: 13,
              password: 'nopass',
              cart: newCart.data._id,
              last_connection: formattedDate()
            }
            const userCreated = await userModel.create(newUser)
            newMessage('success', 'user logged succesfully with passport github', {})
            return done(null, userCreated)
          } else {
            user.last_connection = formattedDate()
            await userModel.updateOne({ _id: user._id.toString() }, user)
            newMessage('success', 'user logged succesfully with passport github', {})
            return done(null, user)
          }
        } catch (e) {
          newMessage('failure', 'Failed to find a user', e.toString(), fileURLToPath(import.meta.url))
          return done(e)
        }
      }
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })
  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id)
    done(null, user)
  })
}
