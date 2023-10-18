import { EErros } from './enums.js'
export function errorCases (errorCode) {
  switch (errorCode) {
    case EErros.INVALID_TYPES_ERROR:
      return 422
    case EErros.DATABASES_ERROR:
      return 500
    case EErros.INCORRECT_CREDENTIALS_ERROR:
      return 417
    case EErros.ROUTING_ERROR:
      return 404
    default:
      return 501
  }
}
