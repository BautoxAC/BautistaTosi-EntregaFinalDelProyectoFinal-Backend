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
      return newMessage('success', 'user Created successfully', user, '', 200)
    } catch (e) {
      return newMessage('failure', 'Failed to create a user', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async getUserByUserName (userName) {
    try {
      const user = await UserManagerDB.getUserByUserName(userName)
      return newMessage('success', 'user Found successfully', user, '', 200)
    } catch (e) {
      return newMessage('failure', 'Failed to find a user', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async changerole (user) {
    try {
      if (user.role === 'user') {
        user.role = 'premium'
      } else {
        user.role = 'user'
      }
      await UserManagerDB.changeRole(user)
      return newMessage('success', 'role changed successfully', user, '', 200)
    } catch (e) {
      return newMessage('failure', 'Failed to change a role', e.toString(), fileURLToPath(import.meta.url), e?.code)
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
      return newMessage('success', 'successfully saved the documents', user.data, '', 200)
    } catch (e) {
      return newMessage('failure', 'Failed to save the documents', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async getUsers () {
    try {
      const users = await UserManagerDB.getUsers()
      const usersDTO = users.map((user) => {
        const userDTO = new UserInfo(user)
        return userDTO
      })
      return newMessage('success', 'successfully found the users', usersDTO, '', 200)
    } catch (e) {
      return newMessage('failure', 'Failed to get the users', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async deleteInactiveUsers () {
    try {
      const users = await UserManagerDB.getUsers()
      const usersDeleted = []
      for (const user of users) {
        const twoDaysInMiliSeconds = 172800000
        const connectionDate = convertirFechaAObjeto(user.last_connection)
        const actualDate = new Date()
        const differenceMiliseconds = actualDate - connectionDate
        if (differenceMiliseconds > twoDaysInMiliSeconds) {
          await this.deleteUserWithCart(user.email, user.cart)
        }
      }
      return newMessage('success', 'successfully deleted the inactive users', usersDeleted, '', 200)
    } catch (e) {
      return newMessage('failure', 'Failed to delete the users', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async deleteUserWithCart (userName, cartId) {
    try {
      if (!cartId) {
        const user = await this.getUserByUserName(userName)
        cartId = user.data.cart
      }
      await CartManager.deleteCart(cartId)
      const userDeleted = await UserManagerDB.deleteUser(userName)
      await sendMail(userDeleted.userDeleted.email, 'Eliminación de cuenta', `
      <div>
        <h1>Su cuenta ha sido eliminada por estar inactiva por dos días o por comprometer los estandares de calidad de productos</h1>
      </div>
      `)
      return newMessage('success', 'successfully deleted the user', userDeleted, '', 200)
    } catch (e) {
      return newMessage('failure', 'Failed to delete a user with his/her cart', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }
}
