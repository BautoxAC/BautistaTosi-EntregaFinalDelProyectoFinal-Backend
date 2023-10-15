import { newMessage } from '../utils/utils.js'
import { ChatManagerDBDAO } from '../DAO/DB/chatManagerDB.dao.js'
import { UsersManagerDBDAO } from '../DAO/DB/usersManagerDB.dao.js'
import { CustomError } from './errors/custom-error.js'
import { EErros } from './errors/enums.js'
import { fileURLToPath } from 'url'
const UsersManagerDB = new UsersManagerDBDAO()
const ChatManagerDB = new ChatManagerDBDAO()
export class ChatManagerDBService {
  async addMessage (message, userName) {
    try {
      const user = await UsersManagerDB.getUserByUserName(userName)
      if (user) {
        const lastAdded = await ChatManagerDB.addMessage(message, userName)
        return newMessage('success', 'Message added successfully', lastAdded, '', 200)
      } else {
        CustomError.createError({
          name: 'Finding user Error',
          cause: 'the user was not found',
          message: 'Error the message could not be sent the user was not found ',
          code: EErros.INCORRECT_CREDENTIALS_ERROR
        })
      }
    } catch (e) {
      return newMessage('failure', 'an error ocurred', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async getMessages () {
    try {
      const messages = await ChatManagerDB.getMessages()
      return newMessage('success', 'Messages got', messages, '', 200)
    } catch (e) {
      return newMessage('failure', 'Messages not found', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }
}
