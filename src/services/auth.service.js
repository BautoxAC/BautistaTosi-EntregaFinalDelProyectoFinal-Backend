import { transport } from '../utils/nodemailer.js'
import config from '../config/env.config.js'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'
import { CustomError } from './errors/custom-error.js'
import { EErros } from './errors/enums.js'
import { newMessage, formattedDate } from '../utils/utils.js'
import { UserManagerDBDAO } from '../DAO/DB/userManagerDB.dao.js'
import { CodeManagerDBDAO } from '../DAO/DB/codeManagerDB.dao.js'
import { dataVerification } from '../utils/dataVerification.js'
const UserManager = new UserManagerDBDAO()
const CodeManager = new CodeManagerDBDAO()
export class AuthService {
  async sendEmail (email, host) {
    try {
      const expire = new Date()
      const code = await CodeManager.createCode(email, uuidv4(), expire.getTime() + 3600000)
      await transport.sendMail({
        from: config.mailSender,
        to: email,
        subject: 'Recuperacion de cuenta',
        html: `
            <div>
              <h1>Aqui esta el link para que puedas restablecer tu cantraseña</h1>
              <a href="http://${host}/auth/passrecover?code=${code.stringCode}&email=${email}">Click aqui<a/>
            </div>
            `
      })
      return newMessage('success', 'Code added and email send successfully', {})
    } catch (e) {
      return newMessage('failure', 'A problem ocurred', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async passRecover (newPass, stringCode, email) {
    try {
      const code = await CodeManager.findCodeByMail(email, stringCode)
      const nowMiliseconds = new Date()
      if (code.expire > nowMiliseconds.getTime()) {
        await UserManager.recoverPass(newPass, email)
        return newMessage('success', 'password succesfully recovered', {})
      } else {
        CustomError.createError({
          name: 'Recovering password error',
          cause: 'The password was not recovered(an hour has passed)',
          message: 'Error trying to recover the password(time)',
          code: EErros.INCORRECT_CREDENTIALS_ERROR
        })
      }
    } catch (e) {
      return newMessage('failure', 'A problem ocurred', e.toString(), fileURLToPath(import.meta.url))
    }
  }

  async updateUser (userMail) {
    try {
      dataVerification([userMail, 'string'])
      const user = await UserManager.getUserByUserName(userMail)
      user.last_connection = formattedDate()
      await UserManager.updateUser(user)
      return newMessage('success', 'user succesfully updated', user)
    } catch (e) {
      return newMessage('failure', 'A problem ocurred', e.toString(), fileURLToPath(import.meta.url))
    }
  }
}
