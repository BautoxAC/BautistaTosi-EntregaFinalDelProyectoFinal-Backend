import { UsersManagerDBService } from '../services/users.service.js'
import { dataResponseToString } from '../utils/dataResponseToString.js'
const UsersManager = new UsersManagerDBService()
export class UsersController {
  async changerole (req, res) {
    try {
      const userName = req.params?.uname
      const response = dataResponseToString(await UsersManager.changerole(userName))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async renderUsers (req, res) {
    try {
      const response = await UsersManager.getUsers()
      return res.render('users', { users: response.data })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async deleteInactiveUsers (req, res) {
    try {
      const response = dataResponseToString(await UsersManager.deleteInactiveUsers())
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async deleteUserWithCart (req, res) {
    try {
      const user = req.params?.uname
      const response = dataResponseToString(await UsersManager.deleteUserWithCart(user))
      return res.render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }
}
