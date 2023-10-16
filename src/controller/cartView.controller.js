import { CartManagerDBService } from '../services/carts.service.js'
const list = new CartManagerDBService()
export class CartViewController {
  async getCartByIdToView (req, res) {
    try {
      const Id = req.params.cid
      const cart = await list.getCartById(Id)
      return res.render('cart', { cart: cart.data, total: cart.data.totalPrices })
    } catch (e) {
      return res.render('error', { error: e.message })
    }
  }
}
