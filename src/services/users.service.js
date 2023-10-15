import { UsersManagerDBDAO } from '../DAO/DB/usersManagerDB.dao.js'
import { newMessage, convertirFechaAObjeto } from '../utils/utils.js'
import { fileURLToPath } from 'url'
import { dataVerification } from '../utils/dataVerification.js'
import { CustomError } from './errors/custom-error.js'
import { CartManagerDBService } from './carts.service.js'
import { EErros } from './errors/enums.js'
import { sendMail } from '../utils/nodemailer.js'
import { UserInfo } from '../DAO/DTOs/userInfo.dto.js'
const CartManager = new CartManagerDBService()
const UsersManagerDB = new UsersManagerDBDAO()
export class UsersManagerDBService {
  async addUsser (userPassword, userName) {
    try {
      const user = UsersManagerDB.addUsser(userPassword, userName)
      return newMessage('success', 'user Created successfully', user, '', 200)
    } catch (e) {
      return newMessage('failure', 'Failed to create a user', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async getUserByUserName (userName) {
    try {
      const user = await UsersManagerDB.getUserByUserName(userName)
      return newMessage('success', 'user Found successfully', user, '', 200)
    } catch (e) {
      return newMessage('failure', 'Failed to find a user', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async changerole (userName) {
    try {
      const user = this.getUserByUserName(userName)
      if (user?.data?.documents.length !== 3) {
        CustomError.createError({
          name: 'Changing a user role Error',
          cause: 'Failed to change the role of a user',
          message: 'Error to change the role of a user',
          code: EErros.DATABASES_ERROR
        })
      }
      if (user.role === 'user') {
        user.role = 'premium'
      } else {
        user.role = 'user'
      }
      await UsersManagerDB.updateUser(user)
      return newMessage('success', 'role changed successfully', user, '', 200)
    } catch (e) {
      return newMessage('failure', 'Failed to change a role', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async getUsers () {
    try {
      const users = await UsersManagerDB.getUsers()
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
      const users = await UsersManagerDB.getUsers()
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
      const userDeleted = await UsersManagerDB.deleteUser(userName)
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
