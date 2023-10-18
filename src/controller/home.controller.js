import { ProductManagerDBService } from '../services/products.service.js'
import { UsersManagerDBService } from '../services/users.service.js'
import { errorCases } from '../services/errors/errorCases.js'
const UsersManager = new UsersManagerDBService()
const list = new ProductManagerDBService()
export class HomeController {
  async renderAllProducts (req, res) {
    try {
      const { limit, page, query, sort } = req.query
      const { email, role, cart } = req.session.user
      const userId = await UsersManager.getUserByUserName(email)
      const pageInfo = await list.getProducts(limit || 10, page || 1, query, sort || 1)
      return res.status(200).render('home', {
        ...pageInfo.data,
        email,
        cart,
        role,
        userId: userId?.data?._id
      })
    } catch (e) {
      return res.status(errorCases(e.statusCode)).render('error', { error: e.message })
    }
  }

  async renderDetails (req, res) {
    try {
      const productId = req.params.pid
      const detailsProduct = await list.getProductById(productId)
      return res.status(200).render('details', { detailsProduct: detailsProduct.data })
    } catch (e) {
      return res.status(errorCases(e.statusCode)).render('error', { error: e.message })
    }
  }
}
