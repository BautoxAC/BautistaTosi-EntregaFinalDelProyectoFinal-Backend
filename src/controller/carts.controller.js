import { CartManagerDBService } from '../services/carts.service.js'
import { newMessage } from '../utils/utils.js'
const list = new CartManagerDBService()
export class CartsController {
  async getCartMycart (req, res) {
    const Id = req.session?.user?.cart
    return res.status(200).json(newMessage('success', 'carrito por id', await list.getCartById(Id)))
  }

  async addCart (req, res) {
    return res.status(200).json(await list.addCart())
  }

  async addProduct (req, res) {
    const idCart = req.params.cid
    const idProduct = req.params.pid
    const owner = req.session.user.email
    const response = await list.addProduct(idCart, idProduct, owner)
    const status = response.status !== 'failure' ? 200 : 400
    return res.status(status).json(response)
  }

  async deleteProduct (req, res) {
    const idCart = req.params.cid
    const idProduct = req.params.pid
    return res.status(200).json(await list.deleteProduct(idCart, idProduct))
  }

  async deleteAllProducts (req, res) {
    const idCart = req.params.cid
    return res.status(200).json(await list.deleteAllProducts(idCart))
  }

  async addNewProducts (req, res) {
    const idCart = req.params.cid
    const products = req.body
    return res.status(200).json(await list.addNewProducts(idCart, products))
  }

  async createATicketToBuy (req, res) {
    const idCart = req.session.user.cart
    const purchaser = req.session.user.email
    return res.status(200).json(await list.createATicketToBuy(idCart, purchaser))
  }
}
