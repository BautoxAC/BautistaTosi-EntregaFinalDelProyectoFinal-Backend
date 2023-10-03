import { CustomError } from '../services/errors/custom-error.js'
import { EErros } from '../services/errors/enums.js'
export function isNotFalsy (arrayToDetermine, numberParameter) {
  const falsyValues = []
  if (Array.isArray(arrayToDetermine) && arrayToDetermine.length > 1) {
    for (let i = 0; i < arrayToDetermine.length; i++) {
      const value = arrayToDetermine[i]
      if (!value) {
        falsyValues.push(i + 1)
      }
    }
    if (falsyValues.length === 0) {
      return 'all the values are not falsy'
    } else {
      CustomError.createError({
        name: 'Error verifying if the values are falsy',
        cause: `The code cannot continue, the next position of the values you sent are falsy ${falsyValues} of the parameter ${numberParameter}`,
        message: `Error trying to continue the code, the next position of the values you sent are falsy ${falsyValues} of the parameter ${numberParameter}`,
        code: EErros.INCORRECT_CREDENTIALS_ERROR
      })
    }
  } else {
    CustomError.createError({
      name: 'Error verifying if the values are falsy',
      cause: 'The code cannot continue, you must send an array that must contain some values to define if they are falsy and the number of the element of the parameter',
      message: 'Error trying to continue the code, the parameter you sent is invalid',
      code: EErros.INCORRECT_CREDENTIALS_ERROR
    })
  }
}
