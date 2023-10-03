import { UserManagerDBService } from '../services/user.service.js'
const UserManager = new UserManagerDBService()
export class UserController {
  async changerole (req, res) {
    const userName = req.session.user.email
    const user = await UserManager.getUserByUserName(userName)
    if (user?.data?.documents.length === 3) {
      const userId = req.params.uid
      req.session.user.role = await UserManager.changerole(req.session.user, userId)
      return res.status(200).json(`rol cambiado a ${req.session.user.role}`)
    }
    return res.status(404).json('rol no ha sido cambiado faltan poner las imagenes en el perfil, en donde dice ver perfil con el icono de perfil')
  }

  renderChangeRole (req, res) {
    return res.render('changeRole')
  }

  async saveDocuments (req, res) {
    const identificacionFile = req.files?.identificacion?.[0]
    const comprobanteDomicilioFile = req.files?.comprobanteDomicilio?.[0]
    const comprobanteEstadoCuentaFile = req.files?.comprobanteEstadoCuenta?.[0]
    const userName = req.session.user.email
    const response = await UserManager.saveDocuments(identificacionFile, comprobanteDomicilioFile, comprobanteEstadoCuentaFile, userName)
    return res.json(response.message)
  }
}
