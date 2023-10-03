import { CurrentUser } from '../DAO/DTOs/currentUser.dto.js'
import { UserManagerDBService } from '../services/user.service.js'
const UserManagerDBServiceControlling = new UserManagerDBService()
export class SessionsController {
  redirectHome (req, res) {
    req.session.user = req.user
    res.redirect('/products')
  }

  async RenderCurrentSession (req, res) {
    const CurrentUserDTO = new CurrentUser(req.session.user)
    const userId = req.session.user._id
    const user = await UserManagerDBServiceControlling.getUserByUserName(req.session.user.email)
    const documents = user.data.documents
    return res.render('profile', { CurrentUserDTO, userId, documents })
  }

  seeCurrentSession (req, res) {
    const CurrentUserDTO = new CurrentUser(req.session.user)
    return res.status(200).json({ Session: CurrentUserDTO })
  }
}
