import { CartManagerDBService } from '../services/carts.service.js'
import { errorCases } from '../services/errors/errorCases.js'
const list = new CartManagerDBService()
export class CartViewController {
  async getCartByIdToView (req, res) {
    try {
      const Id = req.params.cid
      const cart = await list.getCartById(Id)
      return res.status(200).render('cart', { cart: cart.data, total: cart.data.totalPrices })
    } catch (e) {
      return res.status(errorCases(e.statusCode)).render('error', { error: e.message })
    }
  }
}
