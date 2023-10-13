import { UserManagerDBService } from '../services/user.service.js'
const UserManager = new UserManagerDBService()
export class UserAPIController {
  async changerole (req, res) {
    const userName = req.params?.uname
    /* tiene que ser cambiado... */
    const user = await UserManager.getUserByUserName(userName)
    if (user?.data?.documents.length === 3) {
      await UserManager.changerole(user.data)
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

  async getUsers (req, res) {
    const response = await UserManager.getUsers()
    return res.json(response).status(200)
  }

  async deleteInactiveUsers (req, res) {
    const response = await UserManager.deleteInactiveUsers()
    return res.render('response', { response })
  }

  async deleteUserWithCart (req, res) {
    const user = req.params?.uname
    const response = await UserManager.deleteUserWithCart(user)
    return res.render('response', { response })
  }
}
