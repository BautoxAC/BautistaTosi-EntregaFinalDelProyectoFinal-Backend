import { UsersManagerDBService } from '../services/users.service.js'
import { dataResponseToString } from '../utils/dataResponseToString.js'
const UsersManager = new UsersManagerDBService()
export class UsersController {
  async changerole (req, res) {
    const userName = req.params?.uname
    const response = dataResponseToString(await UsersManager.changerole(userName))
    return res.status(200).render('response', { response })
  }

  async renderUsers (req, res) {
    const response = await UsersManager.getUsers()
    return res.render('users', { users: response.data })
  }

  async deleteInactiveUsers (req, res) {
    const response = dataResponseToString(await UsersManager.deleteInactiveUsers())
    return res.status(200).render('response', { response })
  }

  async deleteUserWithCart (req, res) {
    const user = req.params?.uname
    const response = dataResponseToString(await UsersManager.deleteUserWithCart(user))
    return res.render('response', { response })
  }
}
