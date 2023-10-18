import { ChatManagerDBService } from '../services/chat.service.js'
import { errorCases } from '../services/errors/errorCases.js'
const ChatManager = new ChatManagerDBService()
export class ChatController {
  async getMessages (req, res) {
    try {
      const user = req.session.user.email
      const { data } = await ChatManager.getMessages()
      return res.status(200).render('chat', { messages: data.reverse(), user })
    } catch (e) {
      return res.status(errorCases(e.statusCode)).render('error', { error: e.message })
    }
  }
}
