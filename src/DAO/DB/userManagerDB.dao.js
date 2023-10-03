import { userModel } from '../models/users.model.js'
import { EErros } from '../../services/errors/enums.js'
import { createHash, isValidPassword } from '../../utils/utils.js'
import { CustomError } from '../../services/errors/custom-error.js'
export class UserManagerDBDAO {
  async addUsser (userPassword, userName) {
    try {
      await userModel.create({ userPassword, userName })
      const lastAdded = await userModel.findOne({}).sort({ _id: -1 }).lean()
      return lastAdded
    } catch (e) {
      CustomError.createError({
        name: 'Creating a user Error',
        cause: 'Failed to create a user in DAO (check the data)',
        message: 'Error to create a user',
        code: EErros.DATABASES_ERROR
      })
    }
  }

  async getUserByUserName (userName) {
    try {
      const user = await userModel.findOne({ email: userName }).lean()
      return user
    } catch (e) {
      CustomError.createError({
        name: 'Getting a user by userName Error',
        cause: 'Failed to find the User in DAO (check the data)',
        message: 'Error to get a user by userName',
        code: EErros.DATABASES_ERROR
      })
    }
  }

  async recoverPass (newPass, email) {
    try {
      const user = await this.getUserByUserName(email)
      if (user.password === 'nopass') {
        CustomError.createError({
          name: 'Recovering a password',
          cause: 'Failed to find the User in DAO (github)',
          message: 'Error to get a user by userName(github)',
          code: EErros.INCORRECT_CREDENTIALS_ERROR
        })
      }
      if (isValidPassword(newPass, user.password)) {
        CustomError.createError({
          name: 'Recovering a password',
          cause: 'Failed to recover the password in DAO (check the data)',
          message: 'Error to recover a password(password)',
          code: EErros.DATABASES_ERROR
        })
      } else {
        user.password = createHash(newPass)
        const userPasswordRecovered = await userModel.updateOne(user).lean()
        return userPasswordRecovered
      }
    } catch (e) {
      CustomError.createError({
        name: 'Recovering a password',
        cause: 'Failed to recover the password in DAO (check the data)',
        message: e.message,
        code: EErros.DATABASES_ERROR
      })
    }
  }

  async changeRole (userId, updateUser) {
    try {
      const user = await userModel.updateOne({ _id: userId }, updateUser).lean()
      return user
    } catch (e) {
      CustomError.createError({
        name: 'Changing a role Error',
        cause: 'Failed to change the role the User in DAO (check the data)',
        message: 'Error to change a role',
        code: EErros.DATABASES_ERROR
      })
    }
  }

  async updateUser (user) {
    try {
      await userModel.updateOne({ _id: user._id.toString() }, user)
    } catch (e) {
      CustomError.createError({
        name: 'Updating a user Error',
        cause: 'Failed to update the User in DAO (check the data)',
        message: 'Error to update a user',
        code: EErros.DATABASES_ERROR
      })
    }
  }
}
