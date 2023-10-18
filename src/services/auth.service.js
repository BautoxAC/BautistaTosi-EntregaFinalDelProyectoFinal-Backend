import { v4 as uuidv4 } from 'uuid'
import { sendMail } from '../utils/nodemailer.js'
import { fileURLToPath } from 'url'
import { CustomError } from './errors/custom-error.js'
import { EErros } from './errors/enums.js'
import { dataVerification } from '../utils/dataVerification.js'
import { newMessage, formattedDate } from '../utils/utils.js'
import { UsersManagerDBDAO } from '../DAO/DB/usersManagerDB.dao.js'
import { CodeManagerDBDAO } from '../DAO/DB/codeManagerDB.dao.js'
const UsersManager = new UsersManagerDBDAO()
const CodeManager = new CodeManagerDBDAO()
export class AuthService {
  async sendEmail (email, host) {
    try {
      dataVerification([email, host, 'string'])
      const expire = new Date()
      const code = await CodeManager.createCode(email, uuidv4(), expire.getTime() + 3600000)
      await sendMail(email, 'Recuperacion de cuenta', `
      <div>
        <h1>Aqui esta el link para que puedas restablecer tu contraseña</h1>
        <a href="http://${host}/auth/passrecover?code=${code.stringCode}&email=${email}">Click aqui<a/>
      </div>
      `)
      return newMessage('success', 'Code added and email send successfully', {}, '', 200)
    } catch (e) {
      throw newMessage('failure', 'Failed to send the email', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async passRecover (newPass, stringCode, email) {
    try {
      dataVerification([newPass, email, stringCode, 'string'])
      const code = await CodeManager.findCodeByMail(email, stringCode)
      const nowMiliseconds = new Date()
      if (code.expire > nowMiliseconds.getTime()) {
        await UsersManager.recoverPass(newPass, email)
        return newMessage('success', 'password succesfully recovered', {}, '', 200)
      } else {
        CustomError.createError({
          name: 'Recovering password error',
          cause: 'The password was not recovered(an hour has passed)',
          message: 'Error trying to recover the password(time)',
          code: EErros.INCORRECT_CREDENTIALS_ERROR
        })
      }
    } catch (e) {
      throw newMessage('failure', 'The password could not be recovered', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async updateLastConnectionUser (userMail) {
    try {
      if (userMail === 'adminCoder@coder.com') {
        return newMessage('success', 'user is an admin so the last connection cannot be updated', {}, '', 200)
      }
      dataVerification([userMail, 'string'])
      const user = await UsersManager.getUserByUserName(userMail)
      user.last_connection = formattedDate()
      await UsersManager.updateUser(user)
      return newMessage('success', 'user succesfully updated', user, '', 200)
    } catch (e) {
      throw newMessage('failure', 'Failed to close the session', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }

  async saveDocuments (identificacionFile, comprobanteDomicilioFile, comprobanteEstadoCuentaFile, userName) {
    try {
      dataVerification([userName, comprobanteDomicilioFile?.fieldname, comprobanteEstadoCuentaFile?.fieldname, identificacionFile?.fieldname, 'string'], [identificacionFile, comprobanteDomicilioFile, comprobanteEstadoCuentaFile, 'object'])
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
      await UsersManager.updateUser(user.data)
      return newMessage('success', 'successfully saved the documents', user.data, '', 200)
    } catch (e) {
      throw newMessage('failure', 'Failed to save the documents', e.toString(), fileURLToPath(import.meta.url), e?.code)
    }
  }
}
