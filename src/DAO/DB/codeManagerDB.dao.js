import { codeModel } from '../models/code.model.js'
import { EErros } from '../../services/errors/enums.js'
import { CustomError } from '../../services/errors/custom-error.js'
export class CodeManagerDBDAO {
  async createCode (email, stringCode, expire) {
    try {
      const code = await codeModel.create({ email, stringCode, expire })
      return code
    } catch (e) {
      CustomError.createError({
        name: 'Adding code Error',
        cause: 'Failed to create a code in DAO (check the data)',
        message: 'Error to add a code',
        code: EErros.DATABASES_ERROR
      })
    }
  }

  async findCodeByMail (email, stringCode) {
    try {
      const code = await codeModel.findOne({ email, stringCode }).lean()
      return code
    } catch (e) {
      CustomError.createError({
        name: 'Finding code Error',
        cause: 'Failed to find a code in DAO (check the data)',
        message: 'Error to find a code',
        code: EErros.DATABASES_ERROR
      })
    }
  }
}
