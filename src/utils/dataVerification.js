import { isNotFalsy } from './isNotFalsy.js'
import { CustomError } from '../services/errors/custom-error.js'
import { EErros } from '../services/errors/enums.js'
// Esta es una funcion que he utilizado para verificar que distintos datos no sean falsy y ademas que sean deun determinado tipo de dato
export function dataVerification (...params) {
  const dataCorrect = []
  const dataIncorrect = []
  for (let i = 0; i < params.length; i++) {
    const values = params[i]
    if (Array.isArray(values) && values.length > 1) {
      const typeOfData = values[values.length - 1]
      isNotFalsy(values, i + 1)
      for (let i = 0; i < values.length - 1; i++) {
        const data = values[i]
        if (typeof (data) === typeOfData && !(data instanceof RegExp) && !(data instanceof Date)) {
          dataCorrect.push(data)
        } else {
          switch (typeOfData) {
            case 'array':
              if (Array.isArray(data)) {
                dataCorrect.push(data)
              } else { dataIncorrect.push(data) }
              break
            case 'date':
              if (data.constructor === Date) {
                dataCorrect.push(data)
              } else { dataIncorrect.push(data) }
              break
            default:
              dataCorrect.push(false)
              break
          }
        }
      }
    } else {
      CustomError.createError({
        name: 'Data verification error',
        cause: 'The data could not be verified',
        message: `${values}, must be an array that has at least two elements. Which in the firsts elements you write the data you want to know if its data type is correct and the last one is the type of data you do expect to be. Valide types: date, array, object, boolean, string, number`,
        code: EErros.INCORRECT_CREDENTIALS_ERROR
      })
    }
  }
  if (dataIncorrect.length > 0) {
    CustomError.createError({
      name: 'Data verification error',
      cause: 'The data could not be verified',
      message: `${dataIncorrect} these values were bad provided and these were well provided ${dataCorrect}`,
      code: EErros.INVALID_TYPES_ERROR
    })
  }
}
