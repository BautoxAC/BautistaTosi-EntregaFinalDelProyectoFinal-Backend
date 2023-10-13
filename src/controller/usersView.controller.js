import { UserManagerDBService } from '../services/user.service.js'
const UserManager = new UserManagerDBService()
export class UserViewController {
  async renderUsers (req, res) {
    const response = await UserManager.getUsers()
    return res.render('users', { users: response.data })
  }
}
