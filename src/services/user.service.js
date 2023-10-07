import { UserManagerDBDAO } from '../DAO/DB/userManagerDB.dao.js'
import { newMessage, convertirFechaAObjeto } from '../utils/utils.js'
import { fileURLToPath } from 'url'
import { dataVerification } from '../utils/dataVerification.js'
import { CartManagerDBService } from './carts.service.js'
import { sendMail } from '../utils/nodemailer.js'
import { UserInfo } from '../DAO/DTOs/userInfo.dto.js'
const CartManager = new CartManagerDBService()
const UserManagerDB = new UserManagerDBDAO()
export class UserManagerDBService {
  async addUsser (userPassword, userName) {
    try {
      const user = UserManagerDB.addUsser(userPassword, userName)
      return newMessage('success', 'user Created successfully', user)
    } catch (e) {
      return newMessage('failure', 'Failed to create a user', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async getUserByUserName (userName) {
    try {
      const user = await UserManagerDB.getUserByUserName(userName)
      return newMessage('success', 'user Found successfully', user)
    } catch (e) {
      return newMessage('failure', 'Failed to find a user', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async changerole (updateUser, userId) {
    try {
      if (updateUser.role === 'user') {
        updateUser.role = 'premium'
      } else {
        updateUser.role = 'user'
      }
      await UserManagerDB.changeRole(userId, updateUser)
      return updateUser.role
    } catch (e) {
      return newMessage('failure', 'Failed to find a user', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async saveDocuments (identificacionFile, comprobanteDomicilioFile, comprobanteEstadoCuentaFile, userName) {
    try {
      dataVerification([identificacionFile?.fieldname, comprobanteDomicilioFile?.fieldname, comprobanteEstadoCuentaFile?.fieldname, 'string'])
      const user = await this.getUserByUserName(userName)
      user.data.documents.push({
        name: identificacionFile.fieldname,
        reference: identificacionFile.originalname + ' ' + userName
      }, {
        name: comprobanteDomicilioFile.fieldname,
        reference: comprobanteDomicilioFile.originalname + ' ' + userName
      },
      {
        name: comprobanteEstadoCuentaFile.fieldname,
        reference: comprobanteEstadoCuentaFile.originalname + ' ' + userName
      })
      await UserManagerDB.updateUser(user.data)
      return newMessage('success', 'successfully saved the documents', user.data)
    } catch (e) {
      return newMessage('failure', 'Failed to save the documents', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async getUsers () {
    try {
      const users = await UserManagerDB.getUsers()
      const usersDTO = users.map((user) => {
        const userDTO = new UserInfo(user)
        return userDTO
      })
      return newMessage('success', 'successfully found the users', usersDTO)
    } catch (e) {
      return newMessage('failure', 'Failed to get the users', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async deleteInactiveUsers () {
    try {
      const users = await UserManagerDB.getUsers()
      const usersDeleted = []
      for (const user of users) {
        const twoDaysInMiliSeconds = 1
        const connectionDate = convertirFechaAObjeto(user.last_connection)
        const actualDate = new Date()
        const differenceMiliseconds = actualDate - connectionDate
        if (differenceMiliseconds > twoDaysInMiliSeconds) {
          await this.deleteUserWithCart(user.email, user.cart)
        }
      }
      return newMessage('success', 'successfully deleted the inactive users', usersDeleted)
    } catch (e) {
      return newMessage('failure', 'Failed to delete the users', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async deleteUserWithCart (userName, cartId) {
    try {
      await CartManager.deleteCart(cartId)
      const userDeleted = await UserManagerDB.deleteUser(userName)
      await sendMail( userDeleted.userDeleted.email, 'Eliminación de cuenta', `
      <div>
        <h1>Su cuenta ha sido eliminada por estar inactiva por dos días</h1>
      </div>
      `)
      return newMessage('success', 'successfully deleted the user', userDeleted)
    } catch (e) {
      return newMessage('failure', 'Failed to delete a user with his/her cart', e.toString(), fileURLToPath(import.meta.url))
    }
  }
}
