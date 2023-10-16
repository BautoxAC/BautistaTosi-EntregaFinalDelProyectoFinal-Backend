import { CartManagerDBService } from '../services/carts.service.js'
import { dataResponseToString } from '../utils/dataResponseToString.js'
const list = new CartManagerDBService()
export class CartsController {
  async getCartMycart (req, res) {
    try {
      const Id = req.session?.user?.cart
      const response = dataResponseToString(await list.getCartById(Id))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async addCart (req, res) {
    try {
      const response = dataResponseToString(await list.addCart())
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async addProduct (req, res) {
    try {
      const idCart = req.params.cid
      const idProduct = req.params.pid
      const owner = req.session.user.email
      const response = dataResponseToString(await list.addProduct(idCart, idProduct, owner))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async deleteProduct (req, res) {
    try {
      const idCart = req.params.cid
      const idProduct = req.params.pid
      const response = dataResponseToString(await list.deleteProduct(idCart, idProduct))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async deleteAllProducts (req, res) {
    try {
      const idCart = req.params.cid
      const response = dataResponseToString(await list.deleteAllProducts(idCart))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async addNewProducts (req, res) {
    try {
      const idCart = req.params.cid
      const products = req.body
      const response = dataResponseToString(await list.addNewProducts(idCart, products))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }

  async createATicketToBuy (req, res) {
    try {
      const idCart = req.session.user.cart
      const purchaser = req.session.user.email
      const response = dataResponseToString(await list.createATicketToBuy(idCart, purchaser))
      return res.status(200).render('response', { response })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }
}
