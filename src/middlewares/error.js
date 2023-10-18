import { EErros } from '../services/errors/enums.js'
import { newMessage } from '../utils/utils.js'
import { errorCases } from '../services/errors/errorCases.js'
import { fileURLToPath } from 'url'
export function errorHandler (error, req, res, next) {
  newMessage('failure', error.cause, error.message, fileURLToPath(import.meta.url), error?.code)
  const statusCode = errorCases(error.code)
  switch (error.code) {
    case EErros.INVALID_TYPES_ERROR:
      res
        .status(statusCode)
        .send({ status: 'error', error: error.name, cause: error.cause })
      break
    case EErros.DATABASES_ERROR:
      res
        .status(statusCode)
        .send({ status: 'error', error: error.name, cause: error.cause })
      break
    case EErros.INCORRECT_CREDENTIALS_ERROR:
      res
        .status(statusCode)
        .send({ status: 'error', error: error.name, cause: error.cause })
      break
    case EErros.ROUTING_ERROR:
      res
        .status(statusCode)
        .send({ status: 'error', error: error.name, cause: error.cause })
      break
    default:
      res
        .status(statusCode)
        .send({ status: 'error', error: 'Unhandled error' })
      break
  }
}
